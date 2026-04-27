// src/lib/auth/require-admin.ts
import { getCurrentUser } from "@/features/auth/services/get-current.user";
import { getCurrentProfile } from "./get-current-profile";

export async function requireAdmin() {
	const user = await getCurrentUser();

	if (!user) return null;

	const profile = await getCurrentProfile(user.$id);

	if (profile?.role !== "admin") return null;

	return {
		user,
		profile,
	};
}
