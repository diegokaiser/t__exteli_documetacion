import { appwriteServerConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

type SubmitIntakeBody = {
	age: string;
	asylum: string;
	skipped: Record<string, boolean>;
	values: Record<string, string>;
	documents: Array<{
		fieldId: string;
		fileId: string;
		fileName: string;
		fileSize: number;
		mimeType: string;
	}>;
};

export async function POST(req: Request) {
	try {
		const session = await getCurrentSession();

		if (!session || session.role !== "client") {
			return NextResponse.json({ message: "No autorizado" }, { status: 401 });
		}

		const body = (await req.json()) as SubmitIntakeBody;

		if (!Array.isArray(body.documents)) {
			return NextResponse.json(
				{ message: "Payload inválido" },
				{ status: 400 },
			);
		}

		const { databases } = await createAdminClient();

		const cases = await databases.listDocuments(
			appwriteServerConfig.databaseId,
			appwriteServerConfig.casesCollectionId,
			[Query.equal("clientUserId", session.userId)],
		);

		const activeCase = cases.documents[0];

		if (!activeCase) {
			return NextResponse.json(
				{ message: "No existe expediente asociado" },
				{ status: 404 },
			);
		}

		for (const document of body.documents) {
			const submissions = await databases.listDocuments(
				appwriteServerConfig.databaseId,
				appwriteServerConfig.documentSubmissionsCollectionId,
				[
					Query.equal("caseId", activeCase.$id),
					Query.equal("requirementKey", document.fieldId),
				],
			);

			let submission = submissions.documents[0];

			if (!submission) {
				submission = await databases.createDocument(
					appwriteServerConfig.databaseId,
					appwriteServerConfig.documentSubmissionsCollectionId,
					ID.unique(),
					{
						caseId: activeCase.$id,
						requirementKey: document.fieldId,
						status: "uploaded",
						skippedByUser: false,
						requiredAtSubmission: true,
						adminDecision: "pending",
						lastUpdatedAt: new Date().toISOString(),
						notesForClient: null,
					},
				);
			} else {
				submission = await databases.updateDocument(
					appwriteServerConfig.databaseId,
					appwriteServerConfig.documentSubmissionsCollectionId,
					submission.$id,
					{
						status: "uploaded",
						skippedByUser: false,
						adminDecision: "pending",
						lastUpdatedAt: new Date().toISOString(),
					},
				);
			}

			await databases.createDocument(
				appwriteServerConfig.databaseId,
				appwriteServerConfig.documentAssetsCollectionId,
				ID.unique(),
				{
					bucketType: "raw",
					sizeBytes: document.fileSize,
					kind: "original",
					appwriteFileId: document.fileId,
					originalFilename: document.fileName,
					storedFilename: document.fileName,
					mimeType: document.mimeType || null,
					caseId: activeCase.$id,
					submissionId: submission.$id,
					uploadedByUserId: session.userId,
				},
			);
		}

		await databases.updateDocument(
			appwriteServerConfig.databaseId,
			appwriteServerConfig.casesCollectionId,
			activeCase.$id,
			{
				status: "submitted",
				processingStatus: "processing",
				currentStep: 7,
				ageCategory: body.age,
				asylumStatus: body.asylum,
				draftCompleted: true,
				lastEditedAt: new Date().toISOString(),
				submittedAt: new Date().toISOString(),
				updatedBy: session.userId,
			},
		);

		return NextResponse.json({
			ok: true,
			uploadedDocumentsCount: body.documents.length,
			caseId: activeCase.$id,
		});
	} catch (error) {
		console.error("[SUBMIT_INTAKE_ERROR]", error);

		return NextResponse.json(
			{ message: "No se pudo enviar la documentación" },
			{ status: 500 },
		);
	}
}
