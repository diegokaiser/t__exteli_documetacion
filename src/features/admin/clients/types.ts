export type AdminClient = {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	phone?: string | null;
	status: "submitted" | "sent";
	documentType?: "pasaporte" | "nie" | null;
	documentNumber?: string | null;
	emailVerification: boolean;
	labels: string[];
	createdAt: string;
	documentationCount: number;
	documentationStatus: string;
};
