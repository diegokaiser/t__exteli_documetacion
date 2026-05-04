import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { Client, Databases, Query, Users } from "node-appwrite";

type Params = {
	params: Promise<{
		clientId: string;
	}>;
};

export async function GET(_: Request, { params }: Params) {
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
	const users = new Users(client);

	const databaseId = process.env.APPWRITE_DATABASE_ID!;

	try {
		const [profilesResult, casesResult, authUser] = await Promise.all([
			databases.listDocuments(
				databaseId,
				process.env.APPWRITE_PROFILES_COLLECTION_ID!,
				[Query.equal("userId", clientId), Query.limit(1)],
			),

			databases.listDocuments(
				databaseId,
				process.env.APPWRITE_CASES_COLLECTION_ID!,
				[Query.equal("clientUserId", clientId), Query.limit(1)],
			),

			users.get({ userId: clientId }),
		]);

		const profile = profilesResult.documents[0];
		const caseDoc = casesResult.documents[0];

		if (!profile) {
			return NextResponse.json(
				{ message: "Client profile not found" },
				{ status: 404 },
			);
		}

		if (!caseDoc) {
			return NextResponse.json({
				profile,
				authUser,
				case: null,
				documentAssets: [],
				documentSubmissions: [],
			});
		}

		const [documentAssetsResult, documentSubmissionsResult] = await Promise.all(
			[
				databases.listDocuments(
					databaseId,
					process.env.APPWRITE_DOCUMENTS_COLLECTION_ID!,
					[Query.equal("caseId", caseDoc.$id), Query.orderDesc("$createdAt")],
				),

				databases.listDocuments(
					databaseId,
					process.env.APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID!,
					[Query.equal("caseId", caseDoc.$id), Query.orderDesc("$createdAt")],
				),
			],
		);

		return NextResponse.json({
			profile,
			authUser: {
				$id: authUser.$id,
				email: authUser.email,
				name: authUser.name,
				emailVerification: authUser.emailVerification,
				labels: authUser.labels,
			},
			case: caseDoc,
			documentAssets: documentAssetsResult.documents,
			documentSubmissions: documentSubmissionsResult.documents,
		});
	} catch (error) {
		console.error("[ADMIN_CLIENT_DETAIL_ERROR]", error);

		if (error instanceof Error) {
			console.error("[ADMIN_CLIENT_DETAIL_ERROR_MESSAGE]", error.message);
			console.error("[ADMIN_CLIENT_DETAIL_ERROR_STACK]", error.stack);
		}

		return NextResponse.json(
			{ message: "Could not load client detail" },
			{ status: 500 },
		);
	}
}
