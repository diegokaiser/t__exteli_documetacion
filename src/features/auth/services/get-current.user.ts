import { createAdminClient } from "@/lib/appwrite/server";
import { verifySession } from "@/lib/auth/session-token";
import { cookies } from "next/headers";

export async function getCurrentUser() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("portal-session")?.value;

		const session = verifySession(token);

		if (!session?.userId) return null;

		const { users } = await createAdminClient();

		return await users.get(session.userId);
	} catch {
		return null;
	}
}
