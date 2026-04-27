"use client";

import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { useRouter } from "next/navigation";

export function DashboardClient({
	initialData,
}: {
	initialData: DashboardData;
}) {
	const router = useRouter();

	async function handleLogout() {
		await fetch("/api/auth/logout", {
			method: "POST",
		});

		router.replace("/login");
		router.refresh();
	}

	return (
		<DashboardView
			data={initialData}
			onOpenWizard={() => router.push("/app/wizard")}
			onLogout={handleLogout}
		/>
	);
}
