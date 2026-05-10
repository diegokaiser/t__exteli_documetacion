import { z } from "zod";

export const prepareDocumentsSchema = z.object({
	address: z.string().min(1, "La dirección es requerida"),
	phone: z.string().min(1, "El teléfono es requerido"),
	email: z.string().email("Correo inválido"),
	maritalStatus: z.string().min(1, "El estado civil es requerido"),
	fatherName: z.string().min(1, "El nombre del padre es requerido"),
	motherName: z.string().min(1, "El nombre de la madre es requerido"),
	expNumber: z.string().optional(),
});

export type PrepareDocumentsInput = z.infer<typeof prepareDocumentsSchema>;
