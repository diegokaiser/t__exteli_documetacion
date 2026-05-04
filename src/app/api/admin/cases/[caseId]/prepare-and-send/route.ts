import { documentPackageRules } from "@/features/admin/documents/document-package-rules";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { Client, Databases, Query, Storage } from "node-appwrite";
import { PDFDocument } from "pdf-lib";

type Params = {
	params: Promise<{
		caseId: string;
	}>;
};

async function toArrayBuffer(file: unknown): Promise<ArrayBuffer> {
	if (file instanceof ArrayBuffer) {
		return file;
	}

	if (file instanceof Blob) {
		return file.arrayBuffer();
	}

	if (file instanceof Uint8Array) {
		const copy = new Uint8Array(file.byteLength);
		copy.set(file);

		return copy.buffer;
	}

	throw new Error("Unsupported file response type");
}

function toBodyInit(buffer: Uint8Array): BodyInit {
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);

	return copy.buffer;
}

async function mergePdfBuffers(buffers: ArrayBuffer[]) {
	const mergedPdf = await PDFDocument.create();

	for (const buffer of buffers) {
		const pdf = await PDFDocument.load(buffer);
		const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

		for (const page of copiedPages) {
			mergedPdf.addPage(page);
		}
	}

	return mergedPdf.save();
}

function filename(name: string) {
	return `${name}.pdf`;
}

export async function POST(_: Request, { params }: Params) {
	const session = await getCurrentSession();

	if (!session || session.role !== "admin") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { caseId } = await params;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const databases = new Databases(client);
	const storage = new Storage(client);

	const databaseId = process.env.APPWRITE_DATABASE_ID!;
	const submissionsCollectionId =
		process.env.APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID!;
	const assetsCollectionId =
		process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!;
	const bucketId = process.env.APPWRITE_DOCUMENTS_BUCKET_ID!;

	try {
		const [documentSubmissions, documentAssets] = await Promise.all([
			databases.listDocuments(databaseId, submissionsCollectionId, [
				Query.equal("caseId", caseId),
				Query.limit(500),
			]),
			databases.listDocuments(databaseId, assetsCollectionId, [
				Query.equal("caseId", caseId),
				Query.limit(500),
			]),
		]);

		const submissionById = new Map(
			documentSubmissions.documents.map((submission) => [
				submission.$id,
				submission,
			]),
		);

		const assetsByRequirementKey = documentAssets.documents.reduce(
			(acc, asset) => {
				const submission = submissionById.get(asset.submissionId);
				const requirementKey = submission?.requirementKey;

				if (!requirementKey) return acc;

				acc[requirementKey] ??= [];
				acc[requirementKey].push(asset);

				return acc;
			},
			{} as Record<string, typeof documentAssets.documents>,
		);

		const zip = new JSZip();

		const getPdfBuffer = async (fileId: string) => {
			const file = await storage.getFileDownload({
				bucketId,
				fileId,
			});

			return toArrayBuffer(file);
		};

		for (const rule of documentPackageRules) {
			if (rule.mode === "single") {
				const assets = assetsByRequirementKey[rule.requirementKey] ?? [];

				if (assets.length !== 1) continue;

				const asset = assets[0];

				if (asset.mimeType !== "application/pdf") continue;

				const buffer = await getPdfBuffer(asset.appwriteFileId);

				zip.file(filename(rule.outputName), buffer);

				continue;
			}

			if (rule.mode === "merge-all") {
				const assets = assetsByRequirementKey[rule.requirementKey] ?? [];

				if (assets.length === 0) continue;

				const pdfAssets = assets.filter(
					(asset) => asset.mimeType === "application/pdf",
				);

				if (pdfAssets.length === 0) continue;

				if (pdfAssets.length === 1) {
					const buffer = await getPdfBuffer(pdfAssets[0].appwriteFileId);
					zip.file(filename(rule.outputName), buffer);
					continue;
				}

				const buffers = await Promise.all(
					pdfAssets.map((asset) => getPdfBuffer(asset.appwriteFileId)),
				);

				const mergedPdf = await mergePdfBuffers(buffers);

				zip.file(filename(rule.outputName), mergedPdf);

				continue;
			}

			if (rule.mode === "single-with-optional-apostille") {
				const baseAssets = assetsByRequirementKey[rule.requirementKey] ?? [];
				const apostilleAssets =
					assetsByRequirementKey[rule.apostilleRequirementKey] ?? [];

				if (baseAssets.length === 1 && apostilleAssets.length === 1) {
					const buffers = await Promise.all([
						getPdfBuffer(baseAssets[0].appwriteFileId),
						getPdfBuffer(apostilleAssets[0].appwriteFileId),
					]);

					const mergedPdf = await mergePdfBuffers(buffers);

					zip.file(filename(rule.apostilledOutputName), mergedPdf);

					continue;
				}

				if (baseAssets.length === 1 && apostilleAssets.length === 0) {
					const buffer = await getPdfBuffer(baseAssets[0].appwriteFileId);

					zip.file(filename(rule.outputName), buffer);

					continue;
				}
			}
		}

		const zipBuffer = await zip.generateAsync({
			type: "uint8array",
			compression: "DEFLATE",
			compressionOptions: {
				level: 6,
			},
		});

		return new Response(toBodyInit(zipBuffer), {
			headers: {
				"Content-Type": "application/zip",
				"Content-Disposition": `attachment; filename="case-${caseId}-documents.zip"`,
			},
		});
	} catch (error) {
		console.error("[PREPARE_AND_SEND_ERROR]", error);

		return NextResponse.json(
			{ message: "Could not prepare documents" },
			{ status: 500 },
		);
	}
}
