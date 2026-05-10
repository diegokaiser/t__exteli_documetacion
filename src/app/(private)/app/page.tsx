import { DashboardClient } from "@/features/dashboard/components/dashboard-client";
import { getDashboardData } from "@/features/dashboard/services/get-dashboard-data";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { redirect } from "next/navigation";

export default async function ClientDashboardPage() {
	const session = await getCurrentSession();

	if (!session) {
		redirect("/login");
	}

	if (session.role !== "client") {
		redirect("/admin");
	}

	const data = await getDashboardData(session.userId);

	return <DashboardClient initialData={data} />;
}
