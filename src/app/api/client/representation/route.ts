import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";

export async function GET() {
	const session = await getCurrentSession();

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const client = new Client()
			.setEndpoint(process.env.APPWRITE_ENDPOINT!)
			.setProject(process.env.APPWRITE_PROJECT_ID!)
			.setKey(process.env.APPWRITE_API_KEY!);

		const databases = new Databases(client);

		const databaseId = process.env.APPWRITE_DATABASE_ID!;
		const casesCollectionId = process.env.APPWRITE_CASES_COLLECTION_ID!;
		const submissionsCollectionId =
			process.env.APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID!;
		const assetsCollectionId =
			process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!;

		console.log("[CLIENT_REPRESENTATION] Loading case");

		const casesResult = await databases.listDocuments(
			databaseId,
			casesCollectionId,
			[Query.equal("clientUserId", session.userId), Query.limit(1)],
		);

		const caseDoc = casesResult.documents[0];

		if (!caseDoc) {
			return NextResponse.json({
				exists: false,
				fileId: null,
				filename: null,
			});
		}

		console.log("[CLIENT_REPRESENTATION] Case found:", caseDoc.$id);

		const submissionsResult = await databases.listDocuments(
			databaseId,
			submissionsCollectionId,
			[
				Query.equal("caseId", caseDoc.$id),
				Query.equal("requirementKey", "generated-representation"),
				Query.limit(1),
			],
		);

		const submission = submissionsResult.documents[0];

		if (!submission) {
			return NextResponse.json({
				exists: false,
				fileId: null,
				filename: null,
			});
		}

		console.log("[CLIENT_REPRESENTATION] Submission found:", submission.$id);

		const assetsResult = await databases.listDocuments(
			databaseId,
			assetsCollectionId,
			[Query.equal("submissionId", submission.$id), Query.limit(1)],
		);

		const asset = assetsResult.documents[0];

		if (!asset) {
			return NextResponse.json({
				exists: false,
				fileId: null,
				filename: null,
			});
		}

		console.log("[CLIENT_REPRESENTATION] Asset found:", asset.$id);

		return NextResponse.json({
			exists: true,
			fileId: asset.appwriteFileId,
			filename: asset.originalFilename,
		});
	} catch (error) {
		console.error("[CLIENT_REPRESENTATION_ERROR]", error);

		return NextResponse.json(
			{ message: "Could not load representation document" },
			{ status: 500 },
		);
	}
}
