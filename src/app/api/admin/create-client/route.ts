// src/app/api/admin/create-client/route.ts
import { createClientSchema } from "@/features/admin/schemas/create-client.schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const admin = await requireAdmin();

	if (!admin) {
		return NextResponse.json({ message: "No autorizado" }, { status: 401 });
	}

	const body = await req.json();
	const parsed = createClientSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: "Datos inválidos",
				errors: parsed.error.flatten(),
			},
			{ status: 400 },
		);
	}

	/**
	 * Aquí llamarías la Appwrite Function createClientUser.
	 * La Function también debe volver a validar que el caller sea admin.
	 */

	return NextResponse.json({ ok: true });
}
