export const dynamic = "force-dynamic";

import { Toaster } from "@/components/ui/sonner";
import { AdminShell } from "@/features/admin/layout/admin-shell";
import { getCurrentUser } from "@/features/auth/services/get-current.user";
import { redirect } from "next/navigation";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/admin-login");
	}

	if (!user.labels?.includes("Admin")) {
		redirect("/app");
	}

	return (
		<>
			<AdminShell user={user}>{children}</AdminShell>
			<Toaster richColors position="top-right" />
		</>
	);
}
