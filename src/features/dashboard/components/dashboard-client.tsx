"use client";

import { SplashLoader } from "@/components/shared/splash-loader";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardClient({
	initialData,
}: {
	initialData: DashboardData;
}) {
	const [isOpeningWizard, setIsOpeningWizard] = useState(false);

	if (isOpeningWizard) {
		return <SplashLoader message="Preparando formulario..." />;
	}
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
			onOpenWizard={() => {
				setIsOpeningWizard(true);
				router.push("/app/wizard");
			}}
			onLogout={handleLogout}
		/>
	);
}
