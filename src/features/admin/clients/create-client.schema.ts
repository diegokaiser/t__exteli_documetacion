import { z } from "zod";

export const createClientSchema = z
	.object({
		firstName: z.string().min(1, "El nombre es requerido"),
		lastName: z.string().min(1, "Los apellidos son requeridos"),
		email: z.string().email("Email inválido"),
		phone: z.string().optional(),
		documentType: z.enum(["pasaporte", "nie"]).optional(),
		documentNumber: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.documentType && !data.documentNumber) {
			ctx.addIssue({
				code: "custom",
				path: ["documentNumber"],
				message: "El número de documento es requerido",
			});
		}
	});

export type CreateClientInput = z.infer<typeof createClientSchema>;
