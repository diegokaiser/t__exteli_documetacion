import { ClientDetail } from "@/features/admin/clients/client-detail";
import { AdminPageTitle } from "@/features/admin/layout/admin-page-title";

type PageProps = {
	params: Promise<{ clientId: string }>;
};

export default async function AdminClientDetailPage({ params }: PageProps) {
	const { clientId } = await params;

	return (
		<>
			<AdminPageTitle
				title="Detalle del cliente"
				description="Gestiona los clientes registrados en el portal."
				breadcrumbs={["Admin", "Clientes", "Detalle"]}
			/>

			<ClientDetail clientId={clientId} />
		</>
	);
}
