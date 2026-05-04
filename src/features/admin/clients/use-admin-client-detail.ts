import { useQuery } from "@tanstack/react-query";

export function useAdminClientDetail(clientId: string) {
	return useQuery({
		queryKey: ["admin", "client-detail", clientId],
		queryFn: async () => {
			const response = await fetch(`/api/admin/clients/${clientId}`);

			if (!response.ok) {
				throw new Error("No se pudo cargar el detalle del cliente");
			}

			return response.json();
		},
		enabled: Boolean(clientId),
	});
}
