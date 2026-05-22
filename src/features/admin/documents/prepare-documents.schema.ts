import { z } from "zod";
import { allowedDocumentDeliveryEmails } from "./document-delivery-emails";

export const prepareDocumentsSchema = z.object({
	deliveryEmail: z
		.string()
		.email("Correo de destino inválido")
		.refine((email) => allowedDocumentDeliveryEmails.includes(email as any), {
			message: "Correo de destino inválido",
		}),
	address: z.string().min(1, "La dirección es requerida"),
	phone: z.string().min(1, "El teléfono es requerido"),
	email: z.string().email("Correo inválido"),
	maritalStatus: z.string().min(1, "El estado civil es requerido"),
	fatherName: z.string().min(1, "El nombre del padre es requerido"),
	motherName: z.string().min(1, "El nombre de la madre es requerido"),
	asylumExp: z.string().nullable().optional(),
});

export type PrepareDocumentsInput = z.infer<typeof prepareDocumentsSchema>;
