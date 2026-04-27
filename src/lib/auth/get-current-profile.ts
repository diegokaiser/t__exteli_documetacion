import { appwriteServerConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";

export async function getCurrentProfile(userId: string) {
	const { databases } = await createAdminClient();

	const result = await databases.listDocuments(
		appwriteServerConfig.databaseId,
		appwriteServerConfig.profilesCollectionId,
		[Query.equal("userId", userId)],
	);

	return result.documents[0] ?? null;
}
