import { createClientSchema } from "@/features/admin/clients/create-client.schema";
import {
	buildRepresentationFilename,
	generateRepresentationDocx,
} from "@/features/admin/documents/generate-representation-docx";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import {
	Account,
	Client,
	Databases,
	ID,
	Query,
	Storage,
	Users,
} from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function GET() {
	console.log("[LIST_CLIENTS] Request received");

	const session = await getCurrentSession();

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (session.role !== "admin") {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	try {
		const client = new Client()
			.setEndpoint(process.env.APPWRITE_ENDPOINT!)
			.setProject(process.env.APPWRITE_PROJECT_ID!)
			.setKey(process.env.APPWRITE_API_KEY!);

		const databases = new Databases(client);
		const users = new Users(client);

		const profiles = await databases.listDocuments(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_PROFILES_COLLECTION_ID!,
			[
				Query.equal("role", "client"),
				Query.orderDesc("$createdAt"),
				Query.limit(100),
			],
		);

		const clients = await Promise.all(
			profiles.documents.map(async (profile) => {
				const authUser = await users.get({
					userId: profile.userId,
				});

				const casesResult = await databases.listDocuments(
					process.env.APPWRITE_DATABASE_ID!,
					process.env.APPWRITE_CASES_COLLECTION_ID!,
					[Query.equal("clientUserId", profile.userId), Query.limit(1)],
				);

				const caseDoc = casesResult.documents[0];

				let documentationCount = 0;

				if (caseDoc) {
					const assetsResult = await databases.listDocuments(
						process.env.APPWRITE_DATABASE_ID!,
						process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!,
						[Query.equal("caseId", caseDoc.$id), Query.limit(1)],
					);

					documentationCount = assetsResult.total;
				}

				return {
					id: profile.$id,
					userId: profile.userId,
					caseId: caseDoc?.$id || null,
					firstName: profile.firstName,
					lastName: profile.lastName,
					fullName: profile.fullName,
					email: profile.email,
					status: profile.status,
					age: profile.age,
					genre: profile.genre,
					emailVerification: authUser.emailVerification,
					createdAt: profile.$createdAt,
					documentationCount,
					documentationStatus: documentationCount > 0 ? "completed" : "pending",
				};
			}),
		);

		return NextResponse.json({ clients });
	} catch (error) {
		console.error("[LIST_CLIENTS_ERROR]", error);

		return NextResponse.json(
			{ message: "Could not load clients" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	console.log("[CREATE_CLIENT] Request received");

	const session = await getCurrentSession();

	if (!session) {
		console.log("[CREATE_CLIENT] Unauthorized: no session");

		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	console.log("[CREATE_CLIENT] Session OK:", {
		userId: session.userId,
		role: session.role,
	});

	if (session.role !== "admin") {
		console.log("[CREATE_CLIENT] Forbidden: not admin");

		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const body = await request.json();

	console.log("[CREATE_CLIENT] Payload received:", body);

	const parsed = createClientSchema.safeParse(body);

	if (!parsed.success) {
		console.log("[CREATE_CLIENT] Validation failed:", parsed.error.flatten());

		return NextResponse.json(
			{ message: "Invalid payload", errors: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	console.log("[CREATE_CLIENT] Payload validated");

	const input = parsed.data;
	const fullName = `${input.firstName} ${input.lastName}`.trim();
	const now = new Date().toISOString();

	console.log("[CREATE_CLIENT] Full name generated:", fullName);

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	console.log("[CREATE_CLIENT] Appwrite client initialized");

	const users = new Users(client);
	const databases = new Databases(client);
	const storage = new Storage(client);
	const account = new Account(client);

	const databaseId = process.env.APPWRITE_DATABASE_ID!;
	const profilesCollectionId = process.env.APPWRITE_PROFILES_COLLECTION_ID!;
	const casesCollectionId = process.env.APPWRITE_CASES_COLLECTION_ID!;
	const submissionsCollectionId =
		process.env.APPWRITE_DOCUMENT_SUBMISSIONS_COLLECTION_ID!;
	const assetsCollectionId =
		process.env.APPWRITE_DOCUMENT_ASSETS_COLLECTION_ID!;
	const bucketId = process.env.APPWRITE_DOCUMENTS_BUCKET_ID!;

	let createdUserId: string | null = null;
	let createdProfileId: string | null = null;
	let createdCaseId: string | null = null;
	let createdSubmissionId: string | null = null;
	let createdAssetId: string | null = null;
	let createdStorageFileId: string | null = null;

	try {
		console.log("[CREATE_CLIENT] Step 1: Creating auth user");

		const user = await users.create({
			userId: ID.unique(),
			email: input.email,
			name: fullName,
		});

		createdUserId = user.$id;

		console.log("[CREATE_CLIENT] Auth user created:", user.$id);

		console.log("[CREATE_CLIENT] Step 2: Assigning label Cliente");

		await users.updateLabels({
			userId: user.$id,
			labels: ["Cliente"],
		});

		console.log("[CREATE_CLIENT] Label assigned successfully");

		console.log("[CREATE_CLIENT] Step 3: Creating profile");

		const profile = await databases.createDocument(
			databaseId,
			profilesCollectionId,
			ID.unique(),
			{
				role: "client",
				status: "active",
				userId: user.$id,
				email: input.email,
				age: input.age,
				genre: input.genre,
				firstName: input.firstName,
				lastName: input.lastName,
				fullName,
				phone: input.phone || null,
				documentType: input.documentType || null,
				documentNumber: input.documentNumber || null,
				createdBy: session.userId,
			},
		);

		createdProfileId = profile.$id;

		console.log("[CREATE_CLIENT] Profile created:", profile.$id);

		console.log("[CREATE_CLIENT] Step 4: Creating case");

		const caseDoc = await databases.createDocument(
			databaseId,
			casesCollectionId,
			ID.unique(),
			{
				currentStep: 0,
				draftCompleted: false,
				lastEditedAt: now,
				processingStatus: "idle",
				status: "draft",
				assignedAdminId: session.userId,
				clientUserId: user.$id,
				submittedAt: null,
			},
		);

		createdCaseId = caseDoc.$id;

		console.log("[CREATE_CLIENT] Case created:", caseDoc.$id);

		console.log("[CREATE_CLIENT] Step 5: Generating representation DOCX");

		const representationBuffer = await generateRepresentationDocx(input);
		const representationFilename = buildRepresentationFilename(input);

		console.log(
			"[CREATE_CLIENT] Representation filename:",
			representationFilename,
		);

		console.log("[CREATE_CLIENT] Step 6: Uploading representation DOCX");

		const uploadedFile = await storage.createFile({
			bucketId,
			fileId: ID.unique(),
			file: InputFile.fromBuffer(representationBuffer, representationFilename),
		});

		createdStorageFileId = uploadedFile.$id;

		console.log(
			"[CREATE_CLIENT] Representation DOCX uploaded:",
			uploadedFile.$id,
		);

		console.log("[CREATE_CLIENT] Step 7: Creating representation submission");

		const representationSubmission = await databases.createDocument(
			databaseId,
			submissionsCollectionId,
			ID.unique(),
			{
				caseId: caseDoc.$id,
				requirementKey: "generated-representation",
				status: "uploaded",
				skippedByUser: false,
				requiredAtSubmission: true,
				adminDecision: "approved",
				lastUpdatedAt: now,
			},
		);

		createdSubmissionId = representationSubmission.$id;

		console.log(
			"[CREATE_CLIENT] Representation submission created:",
			representationSubmission.$id,
		);

		console.log("[CREATE_CLIENT] Step 8: Creating representation asset");

		const representationAsset = await databases.createDocument(
			databaseId,
			assetsCollectionId,
			ID.unique(),
			{
				bucketType: "raw",
				sizeBytes: uploadedFile.sizeOriginal,
				kind: "generated",
				expiresAt: null,
				deletedAt: null,
				appwriteFileId: uploadedFile.$id,
				originalFilename: representationFilename,
				storedFilename: representationFilename,
				mimeType:
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				caseId: caseDoc.$id,
				submissionId: representationSubmission.$id,
				uploadedByUserId: session.userId,
			},
		);

		createdAssetId = representationAsset.$id;

		console.log(
			"[CREATE_CLIENT] Representation asset created:",
			representationAsset.$id,
		);

		let inviteSent = false;

		try {
			console.log("[CREATE_CLIENT] Step 9: Sending invite email");

			const recoveryUrl = `${process.env.NEXT_PUBLIC_APP_URL}/set-password`;

			console.log("[CREATE_CLIENT] Recovery URL:", recoveryUrl);

			await account.createRecovery({
				email: input.email,
				url: recoveryUrl,
			});

			inviteSent = true;

			console.log("[CREATE_CLIENT] Invite email sent successfully");
		} catch (inviteError) {
			console.error(
				"[CREATE_CLIENT_INVITE_ERROR] Failed sending invite:",
				inviteError,
			);
		}

		console.log("[CREATE_CLIENT] SUCCESS");

		return NextResponse.json(
			{
				userId: user.$id,
				profileId: profile.$id,
				caseId: caseDoc.$id,
				representationSubmissionId: representationSubmission.$id,
				representationAssetId: representationAsset.$id,
				representationFileId: uploadedFile.$id,
				inviteSent,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("[CREATE_CLIENT_ERROR] Fatal error:", error);

		if (createdAssetId) {
			console.log("[ROLLBACK] Deleting representation asset:", createdAssetId);

			await databases
				.deleteDocument(databaseId, assetsCollectionId, createdAssetId)
				.catch((rollbackError) =>
					console.error("[ROLLBACK_ASSET_ERROR]", rollbackError),
				);
		}

		if (createdSubmissionId) {
			console.log(
				"[ROLLBACK] Deleting representation submission:",
				createdSubmissionId,
			);

			await databases
				.deleteDocument(
					databaseId,
					submissionsCollectionId,
					createdSubmissionId,
				)
				.catch((rollbackError) =>
					console.error("[ROLLBACK_SUBMISSION_ERROR]", rollbackError),
				);
		}

		if (createdStorageFileId) {
			console.log("[ROLLBACK] Deleting storage file:", createdStorageFileId);

			await storage
				.deleteFile({
					bucketId,
					fileId: createdStorageFileId,
				})
				.catch((rollbackError) =>
					console.error("[ROLLBACK_STORAGE_FILE_ERROR]", rollbackError),
				);
		}

		if (createdCaseId) {
			console.log("[ROLLBACK] Deleting case:", createdCaseId);

			await databases
				.deleteDocument(databaseId, casesCollectionId, createdCaseId)
				.catch((rollbackError) =>
					console.error("[ROLLBACK_CASE_ERROR]", rollbackError),
				);
		}

		if (createdProfileId) {
			console.log("[ROLLBACK] Deleting profile:", createdProfileId);

			await databases
				.deleteDocument(databaseId, profilesCollectionId, createdProfileId)
				.catch((rollbackError) =>
					console.error("[ROLLBACK_PROFILE_ERROR]", rollbackError),
				);
		}

		if (createdUserId) {
			console.log("[ROLLBACK] Deleting auth user:", createdUserId);

			await users
				.delete({ userId: createdUserId })
				.catch((rollbackError) =>
					console.error("[ROLLBACK_USER_ERROR]", rollbackError),
				);
		}

		return NextResponse.json(
			{ message: "Could not create client" },
			{ status: 500 },
		);
	}
}
