import { NextResponse } from "next/server";
import { Account, Client, Users } from "node-appwrite";
import { z } from "zod";

const setPasswordSchema = z.object({
	userId: z.string().min(1),
	secret: z.string().min(1),
	password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
});

export async function POST(request: Request) {
	const body = await request.json();
	const parsed = setPasswordSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{ message: "Invalid payload", errors: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { userId, secret, password } = parsed.data;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const account = new Account(client);
	const users = new Users(client);

	try {
		await account.updateRecovery({
			userId,
			secret,
			password,
		});

		await users.updateEmailVerification({
			userId,
			emailVerification: true,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[SET_PASSWORD_ERROR]", error);

		return NextResponse.json(
			{ message: "Invalid or expired invitation link" },
			{ status: 400 },
		);
	}
}
