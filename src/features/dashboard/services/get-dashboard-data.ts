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

	return {
		profile: {
			fullName: profile?.fullName ?? user.name ?? "Cliente",
			email: profile?.email ?? user.email,
		},
		case: activeCase
			? {
					id: activeCase.$id,
					status: activeCase.status ?? "pending_documents",
					progress: activeCase.progress ?? 0,
					uploadedDocumentsCount: activeCase.uploadedDocumentsCount ?? 0,
					pendingTasks: activeCase.pendingTasks ?? [],
				}
			: null,
	};
}
