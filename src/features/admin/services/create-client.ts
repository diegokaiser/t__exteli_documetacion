// src/features/admin/services/create-client.ts
import { CreateClientInput } from "../schemas/create-client.schema";

export async function createClient(payload: CreateClientInput) {
	const res = await fetch("/api/admin/create-client", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message ?? "No se pudo crear el cliente");
	}

	return res.json();
}
