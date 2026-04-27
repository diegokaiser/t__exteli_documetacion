import { cookies } from "next/headers";
import { verifySession } from "./session-token";

export async function getCurrentSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get("portal-session")?.value;

	return verifySession(token);
}
