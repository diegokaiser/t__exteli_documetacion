import { getCurrentSession } from "@/lib/auth/get-current-session";
import { NextResponse } from "next/server";
import { Account, Client, Users } from "node-appwrite";

type Params = {
	params: Promise<{
		userId: string;
	}>;
};

export async function POST(_: Request, { params }: Params) {
	const session = await getCurrentSession();

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (session.role !== "admin") {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const { userId } = await params;

	const client = new Client()
		.setEndpoint(process.env.APPWRITE_ENDPOINT!)
		.setProject(process.env.APPWRITE_PROJECT_ID!)
		.setKey(process.env.APPWRITE_API_KEY!);

	const users = new Users(client);
	const account = new Account(client);

	const user = await users.get({ userId });

	if (user.emailVerification) {
		return NextResponse.json(
			{ message: "El cliente ya tiene el correo verificado" },
			{ status: 400 },
		);
	}

	const appUrl = process.env.NEXT_PUBLIC_APP_URL;

	if (!appUrl) {
		return NextResponse.json(
			{ message: "Missing NEXT_PUBLIC_APP_URL" },
			{ status: 500 },
		);
	}

	await account.createRecovery({
		email: user.email,
		url: new URL("/set-password", appUrl).toString(),
	});

	return NextResponse.json({ success: true });
}
