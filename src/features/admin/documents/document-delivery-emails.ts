export const documentDeliveryEmails = [
	{
		label: "Expedientes",
		value: "expedientes.extranjeriagrv@gmail.com",
	},
	{
		label: "Documentación",
		value: "documentacion.extranjeriagrv@gmail.com",
	},
	{
		label: "Piedad Salas Migra",
		value: "piedadsalasmigra@gmail.com",
	},
	{
		label: "Vega Abogados",
		value: "vegaabogados@hotmail.com",
	},
] as const;

export const allowedDocumentDeliveryEmails = documentDeliveryEmails.map(
	(email) => email.value,
);
