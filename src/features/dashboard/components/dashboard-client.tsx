"use client";

import { useRouter } from "next/navigation";
import type { DashboardData } from "../types/dashboard.types";
import { DashboardView } from "./dashboard-view";

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
