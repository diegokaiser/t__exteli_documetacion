import { CreateClientForm } from "@/features/admin/clients/create-client-form";
import { AdminPageTitle } from "@/features/admin/layout/admin-page-title";

export default function NewClientPage() {
	return (
		<>
			<AdminPageTitle
				title="Crear cliente"
				description="Crea un usuario cliente, su perfil y su caso inicial."
				breadcrumbs={["Admin", "Clientes", "Crear cliente"]}
			/>

			<CreateClientForm />
		</>
	);
}
