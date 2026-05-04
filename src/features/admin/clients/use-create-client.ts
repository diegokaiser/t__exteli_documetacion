import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateClientInput } from "./create-client.schema";

export function useCreateClient() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateClientInput) => {
			const response = await fetch("/api/admin/clients", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const error = await response.json().catch(() => null);
				throw new Error(error?.message ?? "Error creating client");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "cases"] });
		},
	});
}
