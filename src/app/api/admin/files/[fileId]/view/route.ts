import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { Client, Storage } from "node-appwrite";

type Params = {
	params: Promise<{
		fileId: string;
	}>;
};

export async function GET(_: Request, { params }: Params) {
	const session = await getCurrentSession();

	if (!session || session.role !== "admin") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { fileId } = await params;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const storage = new Storage(client);

	const file = await storage.getFileView({
		bucketId: process.env.APPWRITE_DOCUMENTS_BUCKET_ID!,
		fileId,
	});

	return new Response(file, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": "inline",
		},
	});
}
