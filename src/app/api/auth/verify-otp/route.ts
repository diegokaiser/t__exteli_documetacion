import { appwriteServerConfig } from "@/lib/appwrite/config";
import { signSession } from "@/lib/auth/session-token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Account, Client, Users } from "node-appwrite";

export async function POST(req: Request) {
	try {
		const { userId, secret } = await req.json();

		if (!userId || !secret) {
			return NextResponse.json(
				{ message: "userId y OTP son requeridos" },
				{ status: 400 },
			);
		}

		const authClient = new Client()
			.setEndpoint(appwriteServerConfig.endpoint)
			.setProject(appwriteServerConfig.projectId);

		const account = new Account(authClient);

		const session = await account.createSession({
			userId,
			secret,
		});

		const adminClient = new Client()
			.setEndpoint(appwriteServerConfig.endpoint)
			.setProject(appwriteServerConfig.projectId)
			.setKey(appwriteServerConfig.apiKey);

		const users = new Users(adminClient);
		const user = await users.get(session.userId);

		if (user.labels?.includes("Admin")) {
			return NextResponse.json(
				{ message: "Usa el login de administrador" },
				{ status: 403 },
			);
		}

		const token = signSession({
			userId: session.userId,
			role: "client",
		});

		const cookieStore = await cookies();

		cookieStore.set("portal-session", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("[VERIFY_OTP_ERROR]", error);

		return NextResponse.json(
			{ message: "Código OTP inválido o expirado" },
			{ status: 401 },
		);
	}
}
