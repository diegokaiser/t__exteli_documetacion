import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";

type Params = {
	params: Promise<{
		clientId: string;
	}>;
};

export async function GET(_request: Request, { params }: Params) {
	const session = await getCurrentSession();

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (session.role !== "admin") {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const { clientId } = await params;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const databases = new Databases(client);

	const databaseId = process.env.APPWRITE_DATABASE_ID!;
	const submissionsCollectionId =
		process.env.APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID!;
	const assetsCollectionId =
		process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!;

	try {
		const submissions = await databases.listDocuments(
			databaseId,
			submissionsCollectionId,
			[
				Query.equal("clientUserId", clientId),
				Query.orderDesc("$createdAt"),
				Query.limit(100),
			],
		);

		const assets = await databases.listDocuments(
			databaseId,
			assetsCollectionId,
			[
				Query.equal("clientUserId", clientId),
				Query.orderDesc("$createdAt"),
				Query.limit(100),
			],
		);

		return NextResponse.json({
			userId: clientId,
			submissions: submissions.documents,
			assets: assets.documents,
		});
	} catch (error) {
		console.error("[CLIENT_DOCUMENTS_ERROR]", error);

		return NextResponse.json(
			{ message: "Could not load client documents" },
			{ status: 500 },
		);
	}
}
