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
			await databases.createDocument(
				appwriteServerConfig.databaseId,
				appwriteServerConfig.documentsCollectionId,
				ID.unique(),
				{
					caseId: activeCase.$id,
					clientUserId: session.userId,
					fieldId: document.fieldId,
					fileId: document.fileId,
					fileName: document.fileName,
					fileSize: document.fileSize,
					mimeType: document.mimeType,
					status: "submitted",
					createdAt: new Date().toISOString(),
				},
			);
		}

		await databases.updateDocument(
			appwriteServerConfig.databaseId,
			appwriteServerConfig.casesCollectionId,
			activeCase.$id,
			{
				status: "submitted",
				age: body.age,
				asylum: body.asylum,
				skipped: body.skipped,
				values: body.values,
				uploadedDocumentsCount: body.documents.length,
				progress: 100,
				submittedAt: new Date().toISOString(),
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
