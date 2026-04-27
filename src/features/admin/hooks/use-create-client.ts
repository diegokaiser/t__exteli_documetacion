// src/features/admin/hooks/use-create-client.ts
import { useMutation } from "@tanstack/react-query";
import { CreateClientInput } from "../schemas/create-client.schema";
import { createClient } from "../services/create-client";

export function useCreateClient() {
	return useMutation({
		mutationFn: (payload: CreateClientInput) => createClient(payload),
	});
}
