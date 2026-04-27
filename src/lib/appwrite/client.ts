import { Account, Client, Databases, Functions } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export { client };
