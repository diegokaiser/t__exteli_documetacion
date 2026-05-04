// scripts/appwrite-schema.ts
import "dotenv/config";
import { Client, Databases } from "node-appwrite";

console.log("ENDPOINT:", process.env.APPWRITE_ENDPOINT);

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT!)
	.setProject(process.env.APPWRITE_PROJECT_ID!)
	.setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function main() {
	const result = await databases.listAttributes(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_CASES_COLLECTION_ID!,
	);

	console.log(JSON.stringify(result, null, 2));
}

main();
