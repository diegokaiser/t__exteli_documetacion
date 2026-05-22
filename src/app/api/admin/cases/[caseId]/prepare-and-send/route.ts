import { buildDocumentsEmailBody } from "@/features/admin/documents/build-documents-email-body";
import { buildDocumentsEmailMetadata } from "@/features/admin/documents/build-documents-email-metadata";
import { documentPackageRules } from "@/features/admin/documents/document-package-rules";
import { prepareDocumentsSchema } from "@/features/admin/documents/prepare-documents.schema";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { Client, Databases, Query, Storage, Users } from "node-appwrite";
import nodemailer from "nodemailer";
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

function requiredEnv(name: string) {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}

	return value;
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
		.setEndpoint(requiredEnv("APPWRITE_ENDPOINT"))
		.setProject(requiredEnv("APPWRITE_PROJECT_ID"))
		.setKey(requiredEnv("APPWRITE_API_KEY"));

	const databases = new Databases(client);
	const storage = new Storage(client);
	const users = new Users(client);

	try {
		const adminUser = await users.get(session.userId);
		const adminFirstName = adminUser.name?.split(" ")[0] ?? "GESTOR";

		const databaseId = requiredEnv("APPWRITE_DATABASE_ID");
		const casesCollectionId = requiredEnv("APPWRITE_CASES_COLLECTION_ID");
		const profilesCollectionId = requiredEnv("APPWRITE_PROFILES_COLLECTION_ID");
		const submissionsCollectionId = requiredEnv(
			"APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID",
		);
		const assetsCollectionId = requiredEnv(
			"APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID",
		);
		const bucketId = requiredEnv("APPWRITE_DOCUMENTS_BUCKET_ID");

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

		const transporter = nodemailer.createTransport({
			host: requiredEnv("SMTP_HOST"),
			port: Number(requiredEnv("SMTP_PORT")),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: requiredEnv("SMTP_USER"),
				pass: requiredEnv("SMTP_APP_PASSWORD"),
			},
		});

		console.log("[SMTP_DEBUG]", {
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: process.env.SMTP_SECURE,
			user: process.env.SMTP_USER,
			from: process.env.SMTP_FROM,
			passwordLength: process.env.SMTP_APP_PASSWORD?.length,
			passwordHasSpaces: process.env.SMTP_APP_PASSWORD?.includes(" "),
			deliveryEmail: form.deliveryEmail,
		});

		await transporter.sendMail({
			from: requiredEnv("SMTP_USER"),
			to: form.deliveryEmail,
			subject,
			html,
			attachments: [
				{
					filename: zipFilename,
					content: Buffer.from(zipBuffer),
					contentType: "application/zip",
				},
			],
		});

		await databases.updateDocument(databaseId, casesCollectionId, caseId, {
			status: "sent",
			lastEditedAt: new Date().toISOString(),
		});

		return NextResponse.json({
			success: true,
			message: "Email sent successfully",
			subject,
			zipFilename,
			zipSizeBytes: zipBuffer.byteLength,
		});
	} catch (error) {
		console.error("[PREPARE_AND_SEND_ERROR]", error);

		return NextResponse.json(
			{
				message:
					error instanceof Error
						? error.message
						: "Could not prepare and send documents",
			},
			{ status: 500 },
		);
	}
}
