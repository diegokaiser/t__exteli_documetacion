// src/features/admin/schemas/create-client.schema.ts
import { z } from "zod";

export const createClientSchema = z
	.object({
		fullName: z.string().min(1, "El nombre completo es requerido"),
		email: z.string().email("Email inválido"),
		phone: z.string().optional(),
		documentType: z.string().optional(),
		documentNumber: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.documentType && !data.documentNumber) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["documentNumber"],
				message: "El número de documento es requerido",
			});
		}
	});

export type CreateClientInput = z.infer<typeof createClientSchema>;
