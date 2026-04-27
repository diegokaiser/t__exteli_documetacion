import { appwriteServerConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function POST(req: Request) {
	try {
		const session = await getCurrentSession();

		if (!session || session.role !== "client") {
			return NextResponse.json({ message: "No autorizado" }, { status: 401 });
		}

		const formData = await req.formData();
		const payloadRaw = formData.get("payload");

		if (typeof payloadRaw !== "string") {
			return NextResponse.json(
				{ message: "Payload inválido" },
				{ status: 400 },
			);
		}

		const payload = JSON.parse(payloadRaw) as {
			age: string;
			asylum: string;
			skipped: Record<string, boolean>;
			values: Record<string, string>;
			fileFields: Record<string, string[]>;
		};

		const { databases, storage } = await createAdminClient();

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

		let uploadedCount = 0;

		for (const [fieldId, fileNames] of Object.entries(payload.fileFields)) {
			for (const fileName of fileNames) {
				const file = formData.get(fileName);

				if (!(file instanceof File)) continue;

				const buffer = Buffer.from(await file.arrayBuffer());

				const uploadedFile = await storage.createFile(
					appwriteServerConfig.documentsBucketId,
					ID.unique(),
					InputFile.fromBuffer(buffer, file.name),
				);

				await databases.createDocument(
					appwriteServerConfig.databaseId,
					appwriteServerConfig.documentsCollectionId,
					ID.unique(),
					{
						caseId: activeCase.$id,
						clientUserId: session.userId,
						fieldId,
						fileId: uploadedFile.$id,
						fileName: file.name,
						fileSize: file.size,
						mimeType: file.type,
						status: "submitted",
						createdAt: new Date().toISOString(),
					},
				);

				uploadedCount += 1;
			}
		}

		await databases.updateDocument(
			appwriteServerConfig.databaseId,
			appwriteServerConfig.casesCollectionId,
			activeCase.$id,
			{
				status: "submitted",
				age: payload.age,
				asylum: payload.asylum,
				skipped: payload.skipped,
				values: payload.values,
				uploadedDocumentsCount: uploadedCount,
				progress: 100,
				submittedAt: new Date().toISOString(),
			},
		);

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("[SUBMIT_INTAKE_ERROR]", error);

		return NextResponse.json(
			{ message: "No se pudo enviar la documentación" },
			{ status: 500 },
		);
	}
}
