import { useQuery } from "@tanstack/react-query";
import type { AdminClient } from "./types";

export function useAdminClients() {
	return useQuery({
		queryKey: ["admin", "clients"],
		queryFn: async () => {
			const response = await fetch("/api/admin/clients");

			if (!response.ok) {
				throw new Error("No se pudieron cargar los clientes");
			}

			const data = await response.json();

			return data.clients as AdminClient[];
		},
	});
}
