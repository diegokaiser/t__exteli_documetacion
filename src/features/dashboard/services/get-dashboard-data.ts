import { appwriteServerConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import type { DashboardData } from "../types/dashboard.types";

export async function getDashboardData(userId: string): Promise<DashboardData> {
	const { users, databases } = await createAdminClient();

	const user = await users.get(userId);

	const profiles = await databases.listDocuments(
		appwriteServerConfig.databaseId,
		appwriteServerConfig.profilesCollectionId,
		[Query.equal("userId", userId)],
	);

	const profile = profiles.documents[0];

	const cases = await databases.listDocuments(
		appwriteServerConfig.databaseId,
		appwriteServerConfig.casesCollectionId,
		[Query.equal("clientUserId", userId)],
	);

	const activeCase = cases.documents[0];

	if (!activeCase) {
		return {
			profile: {
				fullName: profile?.fullName ?? user.name ?? "Cliente",
				email: profile?.email ?? user.email,
			},
			case: null,
		};
	}

	const documentAssets = await databases.listDocuments(
		appwriteServerConfig.databaseId,
		appwriteServerConfig.documentAssetsCollectionId,
		[Query.equal("caseId", activeCase.$id)],
	);

	const uploadedDocumentsCount = documentAssets.total;
	const submittedAt = activeCase.submittedAt ?? null;
	const hasSubmittedDocuments = Boolean(submittedAt);

	return {
		profile: {
			fullName: profile?.fullName ?? user.name ?? "Cliente",
			email: profile?.email ?? user.email,
		},
		case: {
			id: activeCase.$id,
			status: activeCase.status ?? "pending_documents",
			progress: hasSubmittedDocuments ? 100 : 0,
			uploadedDocumentsCount,
			pendingTasks: hasSubmittedDocuments
				? []
				: ["Completa y envía tu documentación desde el formulario."],
			submittedAt,
			hasSubmittedDocuments,
		},
	};
}
