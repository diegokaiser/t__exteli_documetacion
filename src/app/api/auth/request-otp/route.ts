import { appwriteServerConfig } from "@/lib/appwrite/config";
import { NextResponse } from "next/server";
import { Account, Client, ID } from "node-appwrite";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ message: "Email requerido" }, { status: 400 });
		}

		const client = new Client()
			.setEndpoint(appwriteServerConfig.endpoint)
			.setProject(appwriteServerConfig.projectId);

		const account = new Account(client);

		const token = await account.createEmailToken({
			userId: ID.unique(),
			email,
			phrase: true,
		});

		return NextResponse.json({
			userId: token.userId,
			phrase: token.phrase,
		});
	} catch (error) {
		console.error("[REQUEST_OTP_ERROR]", error);

		return NextResponse.json(
			{ message: "No se pudo enviar el código OTP" },
			{ status: 500 },
		);
	}
}
