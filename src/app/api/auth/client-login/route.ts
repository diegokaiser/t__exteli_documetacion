import { appwriteServerConfig } from "@/lib/appwrite/config";
import { signSession } from "@/lib/auth/session-token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Account, Client, Users } from "node-appwrite";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ message: "Email y contraseña son requeridos" },
				{ status: 400 },
			);
		}

		const authClient = new Client()
			.setEndpoint(appwriteServerConfig.endpoint)
			.setProject(appwriteServerConfig.projectId);

		const account = new Account(authClient);

		const session = await account.createEmailPasswordSession(email, password);

		if (!session.userId) {
			return NextResponse.json(
				{ message: "Appwrite no devolvió userId de sesión" },
				{ status: 500 },
			);
		}

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

		return NextResponse.json({
			ok: true,
			userId: session.userId,
		});
	} catch (error) {
		console.error("[CLIENT_LOGIN_ERROR]", error);

		return NextResponse.json(
			{
				message:
					error instanceof Error
						? error.message
						: "No se pudo iniciar sesión como cliente",
			},
			{ status: 500 },
		);
	}
}
