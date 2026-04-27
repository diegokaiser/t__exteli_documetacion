import { AdminLoginInput } from "../schemas/admin-login.schema";

export async function adminLogin(payload: AdminLoginInput) {
	const res = await fetch("/api/auth/admin-login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const contentType = res.headers.get("content-type");

	const data = contentType?.includes("application/json")
		? await res.json()
		: null;

	if (!res.ok) {
		throw new Error(data?.message ?? "Error al iniciar sesión como admin");
	}

	return data;
}
