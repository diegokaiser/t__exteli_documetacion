export const dynamic = "force-dynamic";

import { AdminLoginForm } from "@/features/admin/components/admin-login-form";
import { getCurrentUser } from "@/features/auth/services/get-current.user";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
	const user = await getCurrentUser();

	if (user) {
		if (user.labels?.includes("Admin")) {
			redirect("/admin");
		}

		redirect("/app");
	}

	return <AdminLoginForm />;
}
