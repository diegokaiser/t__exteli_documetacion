import { ClientsTable } from "@/features/admin/clients/clients-table";
import { AdminPageTitle } from "@/features/admin/layout/admin-page-title";

export default function AdminClientsPage() {
	return (
		<>
			<AdminPageTitle
				title="Clientes"
				description="Gestiona los clientes registrados en el portal."
				breadcrumbs={["Admin", "Clientes"]}
			/>

			<ClientsTable />
		</>
	);
}
