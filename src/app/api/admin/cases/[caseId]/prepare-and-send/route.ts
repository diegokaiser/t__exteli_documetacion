import { buildDocumentsEmailBody } from "@/features/admin/documents/build-documents-email-body";
import { buildDocumentsEmailMetadata } from "@/features/admin/documents/build-documents-email-metadata";
import { documentPackageRules } from "@/features/admin/documents/document-package-rules";
import { prepareDocumentsSchema } from "@/features/admin/documents/prepare-documents.schema";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { Client, Databases, Query, Storage, Users } from "node-appwrite";
import { PDFDocument } from "pdf-lib";

const PDF_MIME = "application/pdf";
const DOCX_MIME =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type Params = {
	params: Promise<{
		caseId: string;
	}>;
};

async function toArrayBuffer(file: unknown): Promise<ArrayBuffer> {
	if (file instanceof ArrayBuffer) return file;
	if (file instanceof Blob) return file.arrayBuffer();

	if (file instanceof Uint8Array) {
		const copy = new Uint8Array(file.byteLength);
		copy.set(file);
		return copy.buffer;
	}

	throw new Error("Unsupported file response type");
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

function pdfFilename(name: string) {
	return `${name}.pdf`;
}

function docxFilename(name: string) {
	return `${name}.docx`;
}

export async function POST(request: Request, { params }: Params) {
	const session = await getCurrentSession();

	if (!session || session.role !== "admin") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const parsed = prepareDocumentsSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{ message: "Invalid payload", errors: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const form = parsed.data;
	const { caseId } = await params;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const databases = new Databases(client);
	const storage = new Storage(client);
	const users = new Users(client);

	const adminUser = await users.get({
		userId: session.userId,
	});

	const adminFirstName = adminUser.name?.split(" ")[0] ?? "GESTOR";

	const databaseId = process.env.APPWRITE_DATABASE_ID!;
	const casesCollectionId = process.env.APPWRITE_CASES_COLLECTION_ID!;
	const profilesCollectionId = process.env.APPWRITE_PROFILES_COLLECTION_ID!;
	const submissionsCollectionId =
		process.env.APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID!;
	const assetsCollectionId =
		process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!;
	const bucketId = process.env.APPWRITE_DOCUMENTS_BUCKET_ID!;

	try {
		const caseDoc = await databases.getDocument(
			databaseId,
			casesCollectionId,
			caseId,
		);

		const profilesResult = await databases.listDocuments(
			databaseId,
			profilesCollectionId,
			[Query.equal("userId", caseDoc.clientUserId), Query.limit(1)],
		);

		const profile = profilesResult.documents[0];

		if (!profile) {
			return NextResponse.json(
				{ message: "Client profile not found" },
				{ status: 404 },
			);
		}

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

		const getFileBuffer = async (fileId: string) => {
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
				const buffer = await getFileBuffer(asset.appwriteFileId);

				if (asset.mimeType === PDF_MIME) {
					zip.file(pdfFilename(rule.outputName), buffer);
					continue;
				}

				if (asset.mimeType === DOCX_MIME) {
					zip.file(docxFilename(rule.outputName), buffer);
					continue;
				}

				continue;
			}

			if (rule.mode === "merge-all") {
				const assets = assetsByRequirementKey[rule.requirementKey] ?? [];

				if (assets.length === 0) continue;

				const pdfAssets = assets.filter((asset) => asset.mimeType === PDF_MIME);
				const docxAssets = assets.filter(
					(asset) => asset.mimeType === DOCX_MIME,
				);

				if (pdfAssets.length === 1) {
					const buffer = await getFileBuffer(pdfAssets[0].appwriteFileId);
					zip.file(pdfFilename(rule.outputName), buffer);
				}

				if (pdfAssets.length > 1) {
					const buffers = await Promise.all(
						pdfAssets.map((asset) => getFileBuffer(asset.appwriteFileId)),
					);

					const mergedPdf = await mergePdfBuffers(buffers);
					zip.file(pdfFilename(rule.outputName), mergedPdf);
				}

				for (let index = 0; index < docxAssets.length; index++) {
					const asset = docxAssets[index];
					const buffer = await getFileBuffer(asset.appwriteFileId);

					const suffix = docxAssets.length > 1 ? `-${index + 1}` : "";

					zip.file(docxFilename(`${rule.outputName}${suffix}`), buffer);
				}

				continue;
			}

			if (rule.mode === "single-with-optional-apostille") {
				const baseAssets = assetsByRequirementKey[rule.requirementKey] ?? [];
				const apostilleAssets =
					assetsByRequirementKey[rule.apostilleRequirementKey] ?? [];

				const basePdfAssets = baseAssets.filter(
					(asset) => asset.mimeType === PDF_MIME,
				);
				const apostillePdfAssets = apostilleAssets.filter(
					(asset) => asset.mimeType === PDF_MIME,
				);

				if (basePdfAssets.length === 1 && apostillePdfAssets.length === 1) {
					const buffers = await Promise.all([
						getFileBuffer(basePdfAssets[0].appwriteFileId),
						getFileBuffer(apostillePdfAssets[0].appwriteFileId),
					]);

					const mergedPdf = await mergePdfBuffers(buffers);
					zip.file(pdfFilename(rule.apostilledOutputName), mergedPdf);
					continue;
				}

				if (baseAssets.length === 1 && apostilleAssets.length === 0) {
					const asset = baseAssets[0];
					const buffer = await getFileBuffer(asset.appwriteFileId);

					if (asset.mimeType === PDF_MIME) {
						zip.file(pdfFilename(rule.outputName), buffer);
					}

					if (asset.mimeType === DOCX_MIME) {
						zip.file(docxFilename(rule.outputName), buffer);
					}

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

		const { subject, zipFilename } = buildDocumentsEmailMetadata({
			sessionUser: {
				firstName: adminFirstName,
			},
			profile: {
				fullName: profile.fullName,
			},
			caseDoc: {
				ageCategory: caseDoc.ageCategory,
			},
			assetsByRequirementKey,
		});

		const html = buildDocumentsEmailBody({
			clientFullName: profile.fullName,
			form,
		});

		console.log("[PREPARE_EMAIL_SUBJECT]", subject);
		console.log("[PREPARE_EMAIL_ZIP_FILENAME]", zipFilename);
		console.log("[PREPARE_EMAIL_BODY]", html);
		console.log("[PREPARE_EMAIL_ZIP_SIZE_BYTES]", zipBuffer.byteLength);

		return NextResponse.json({
			success: true,
			subject,
			zipFilename,
			html,
			zipSizeBytes: zipBuffer.byteLength,
		});
	} catch (error) {
		console.error("[PREPARE_AND_SEND_ERROR]", error);

		return NextResponse.json(
			{ message: "Could not prepare documents" },
			{ status: 500 },
		);
	}
}
