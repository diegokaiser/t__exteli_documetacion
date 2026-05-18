// src/app/api/client/files/[fileId]/download/route.ts

import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { Client, Databases, Query, Storage } from "node-appwrite";

type Params = {
	params: Promise<{
		fileId: string;
	}>;
};

export async function GET(_: Request, { params }: Params) {
	const session = await getCurrentSession();

	if (!session || session.role !== "client") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { fileId } = await params;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const databases = new Databases(client);
	const storage = new Storage(client);

	const databaseId = process.env.APPWRITE_DATABASE_ID!;
	const casesCollectionId = process.env.APPWRITE_CASES_COLLECTION_ID!;
	const assetsCollectionId =
		process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!;
	const bucketId = process.env.APPWRITE_DOCUMENTS_BUCKET_ID!;

	try {
		const casesResult = await databases.listDocuments(
			databaseId,
			casesCollectionId,
			[Query.equal("clientUserId", session.userId), Query.limit(1)],
		);

		const caseDoc = casesResult.documents[0];

		if (!caseDoc) {
			return NextResponse.json({ message: "Case not found" }, { status: 404 });
		}

		const assetsResult = await databases.listDocuments(
			databaseId,
			assetsCollectionId,
			[
				Query.equal("caseId", caseDoc.$id),
				Query.equal("appwriteFileId", fileId),
				Query.limit(1),
			],
		);

		const asset = assetsResult.documents[0];

		if (!asset) {
			return NextResponse.json({ message: "File not found" }, { status: 404 });
		}

		const file = await storage.getFileDownload({
			bucketId,
			fileId,
		});

		const filename = asset.originalFilename ?? "documento";

		return new Response(file, {
			headers: {
				"Content-Type": asset.mimeType ?? "application/octet-stream",
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
	} catch (error) {
		console.error("[CLIENT_FILE_DOWNLOAD_ERROR]", error);

		return NextResponse.json(
			{ message: "Could not download file" },
			{ status: 500 },
		);
	}
}
