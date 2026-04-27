import { cookies } from "next/headers";
import {
	Account,
	Client,
	Databases,
	Functions,
	Storage,
	Users,
} from "node-appwrite";
import { appwriteServerConfig } from "./config";

export async function createSessionClient() {
	const cookieStore = await cookies();
	const session = cookieStore.get("appwrite-session")?.value;

	if (!session) return null;

	const client = new Client()
		.setEndpoint(appwriteServerConfig.endpoint)
		.setProject(appwriteServerConfig.projectId)
		.setSession(session);

	return {
		account: new Account(client),
		databases: new Databases(client),
		functions: new Functions(client),
	};
}

export async function createAdminClient() {
	const client = new Client()
		.setEndpoint(appwriteServerConfig.endpoint)
		.setProject(appwriteServerConfig.projectId)
		.setKey(appwriteServerConfig.apiKey);

	return {
		account: new Account(client),
		databases: new Databases(client),
		functions: new Functions(client),
		storage: new Storage(client),
		users: new Users(client),
	};
}
