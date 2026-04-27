export const appwriteConfig = {
	endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
};

export const appwriteServerConfig = {
	endpoint: process.env.APPWRITE_ENDPOINT!,
	projectId: process.env.APPWRITE_PROJECT_ID!,
	apiKey: process.env.APPWRITE_API_KEY!,
	databaseId: process.env.APPWRITE_DATABASE_ID!,
	profilesCollectionId: process.env.APPWRITE_PROFILES_COLLECTION_ID!,
	casesCollectionId: process.env.APPWRITE_CASES_COLLECTION_ID!,
	createClientFunctionId: process.env.APPWRITE_CREATE_CLIENT_FUNCTION_ID!,
	documentsCollectionId: process.env.APPWRITE_DOCUMENTS_COLLECTION_ID!,
	documentsBucketId: process.env.APPWRITE_DOCUMENTS_BUCKET_ID!,
};
