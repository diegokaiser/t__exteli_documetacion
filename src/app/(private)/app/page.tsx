"use client";

import { useDemoSession } from "@/features/auth/hooks/use-demo-session";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { useRouter } from "next/navigation";

export default function ClientDashboardPage() {
	const router = useRouter();
	const { logout } = useDemoSession();

	return (
		<DashboardView
			onOpenWizard={() => router.push("/app/wizard")}
			onLogout={() => {
				logout();
				router.replace("/login");
			}}
		/>
	);
}
