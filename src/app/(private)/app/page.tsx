import { DashboardClient } from "@/features/dashboard/components/dashboard-client";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";

export default async function ClientDashboardPage() {
	// Temporal hasta conectar Appwrite real
	const data: DashboardData = {
		profile: {
			fullName: "Cliente Demo",
			email: "cliente@correo.com",
		},
		case: {
			id: "demo-case",
			status: "pending_documents",
			progress: 0,
			uploadedDocumentsCount: 0,
			pendingTasks: [
				"Subir tarjeta de residencia",
				"Adjuntar nóminas del último trimestre",
				"Añadir documentos complementarios",
			],
		},
	};

	return <DashboardClient initialData={data} />;
}
