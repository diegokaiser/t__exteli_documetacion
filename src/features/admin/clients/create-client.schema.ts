import { z } from "zod";
import { allowedCasesNames } from "../cases/cases-names";

export const createClientSchema = z
	.object({
		caseName: z.enum(allowedCasesNames, {
			message: "Selecciona el trámite",
		}),
		age: z.enum(["adult", "minor"], {
			message: "Selecciona la edad",
		}),

		genre: z.enum(["female", "male"], {
			message: "Selecciona el género",
		}),

		firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),

		lastName: z
			.string()
			.min(2, "Los apellidos deben tener al menos 2 caracteres"),

		email: z.email("Ingresa un correo válido"),

		phone: z.string().optional(),

		documentType: z.enum(["pasaporte", "nie"]).optional(),

		documentNumber: z.string().optional(),

		guardianFirstName: z.string().optional(),

		guardianLastName: z.string().optional(),

		guardianGenre: z.enum(["female", "male"]).optional(),

		guardianDocumentType: z.enum(["pasaporte", "nie"]).optional(),

		guardianDocumentNumber: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.documentType && !data.documentNumber) {
			ctx.addIssue({
				code: "custom",
				path: ["documentNumber"],
				message: "El número de documento es requerido",
			});
		}

		if (data.age === "minor") {
			if (!data.guardianFirstName?.trim()) {
				ctx.addIssue({
					code: "custom",
					path: ["guardianFirstName"],
					message: "El nombre del apoderado es requerido",
				});
			}

			if (!data.guardianLastName?.trim()) {
				ctx.addIssue({
					code: "custom",
					path: ["guardianLastName"],
					message: "Los apellidos del apoderado son requeridos",
				});
			}

			if (!data.guardianGenre) {
				ctx.addIssue({
					code: "custom",
					path: ["guardianGenre"],
					message: "Selecciona el género del apoderado",
				});
			}

			if (!data.guardianDocumentType) {
				ctx.addIssue({
					code: "custom",
					path: ["guardianDocumentType"],
					message: "Selecciona el tipo de documento del apoderado",
				});
			}

			if (!data.guardianDocumentNumber?.trim()) {
				ctx.addIssue({
					code: "custom",
					path: ["guardianDocumentNumber"],
					message: "El documento del apoderado es requerido",
				});
			}
		}
	});

export type CreateClientInput = z.infer<typeof createClientSchema>;
