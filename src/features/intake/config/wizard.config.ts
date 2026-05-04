import {
	ConditionalField,
	FileConditionalField,
} from "@/features/intake/types/wizard.types";

const PDF_ONLY = ["application/pdf"];

type LaborDocumentsConfig = {
	adult: {
		asylumYes: ConditionalField[];
		asylumNo: ConditionalField[];
		vulnerability: FileConditionalField;
	};
	minor: {
		asylumYes: ConditionalField[];
		asylumNo: ConditionalField[];
	};
};

export const personalDocuments: Record<"adult" | "minor", ConditionalField[]> =
	{
		adult: [
			{
				id: "passport-adult",
				label: "Pasaporte completo a color",
				hint: "Escanea todas las hojas, incluso si no tienen anotaciones.",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 8,
			},
			{
				id: "criminal-record",
				label: "Antecedentes penales",
				hint: "NOTA: Si tu documento está junto con la Apostilla, no te preocupes, adjuntalo igual. Debe estar dentro del periodo de vigencia.",
				multiple: true,
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "apostille-criminal-record",
				label: "Apostilla de antecedentes penales",
				hint: "Obvia este paso si adjuntaste los Antecedentes Penales junto con la Apostilla.",
				multiple: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "individual-registration-adult",
				label: "Empadronamiento individual",
				hint: "Debe estar dentro del periodo de vigencia de 3 meses.",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "historical-registration-adult",
				label: "Empadronamiento histórico",
				hint: "Debe estar dentro del periodo de vigencia de 3 meses.",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
		],
		minor: [
			{
				id: "passport-minor",
				label: "Pasaporte completo a color",
				hint: "Escanea todas las hojas, incluso si no tienen anotaciones.",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 8,
			},
			{
				id: "birth-certificate",
				label: "Acta, Partida o Certificado de nacimiento",
				hint: "Si tu documento está junto con la Apostilla, no te preocupes, adjuntalo igual.",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "birth-certificate-apostille",
				label: "Apostilla del Acta, Partida o Certificado de nacimiento",
				hint: "Obvia este paso si adjuntaste el Acta, Partida o Certificado junto con la Apostilla.",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "individual-registration-minor",
				label: "Empadronamiento individual",
				hint: "Debe estar dentro del periodo de vigencia de 3 meses.",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "historical-registration-minor",
				label: "Empadronamiento histórico",
				hint: "Debe estar dentro del periodo de vigencia de 3 meses.",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "collective-registration-minor",
				label: "Empadronamiento colectivo",
				hint: "Debe estar dentro del periodo de vigencia de 3 meses.",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
		],
	};

export const laborDocuments: LaborDocumentsConfig = {
	adult: {
		asylumYes: [
			{
				id: "white-letter-adult",
				label: "Carta blanca",
				hint: "Si ya no tienes este documento porque lo canjeaste, no pasa nada",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "exp-number-adult-asylum",
				type: "text",
				label: "EXP: N°",
				hint: "Introduce solo números. Máximo 14 caracteres.",
				required: true,
				inputMode: "numeric",
				maxLength: 12,
				pattern: /^\d{1,12}$/,
			},
			{
				id: "red-card-adult",
				label: "Tarjeta roja",
				hint: "Los datos deben ser legibles",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "working-life-adult-asylum",
				label: "Vida laboral",
				hint: `Lo encuentras en portal.seg-social.gob.es`,
				accept: PDF_ONLY,
				maxSizeMB: 1,
			},
			{
				id: "latest-payroll-adult-asylum",
				label: "Últimas nóminas",
				hint: "Si no tienes nóminas, no pasa nada",
				multiple: true,
				accept: PDF_ONLY,
				maxSizeMB: 6,
			},
			{
				id: "employment-contract-adult-asylum",
				label: "Contrato de trabajo",
				hint: "Si no tienes contrato de trabajo, no pasa nada",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
		],
		asylumNo: [
			{
				id: "working-life-adult",
				label: "Vida laboral",
				hint: `Lo encuentras en portal.seg-social.gob.es`,
				optionalToggle: "No tengo",
				accept: PDF_ONLY,
				maxSizeMB: 1,
			},
			{
				id: "precontract-adult",
				label: "Precontrato",
				hint: "Mínimo de 20 horas semanales.",
				optionalToggle: "No tengo",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "collective-registration-descendants",
				label: "Empadronamiento colectivo",
				hint: "Si vives con descendientes directos menores de edad.",
				optionalToggle: "No tengo",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "collective-registration-descendants-disability",
				label: "Empadronamiento colectivo",
				hint: "Si vives con descendientes directos con alguna discapacidad.",
				optionalToggle: "No tengo",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "collective-certificate-descendants-disability",
				label: "Certificado de Discapacidad",
				hint: "Adjunta el Certificado que reconoce la discapacidad de tu descendiente directo.",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "collective-registration-ascendants",
				label: "Empadronamiento colectivo",
				hint: "Si vives con ascendientes directos con documentación en regla.",
				optionalToggle: "No tengo",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
		],
		vulnerability: {
			id: "vulnerability-report",
			label: "Informe de vulnerabilidad sellado",
			hint: "Sin cita previa en extranjeriagrv.es/regularizacion-masiva/vulnerabilidad",
			required: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
	},
	minor: {
		asylumYes: [
			{
				id: "white-letter-minor",
				label: "Carta blanca",
				hint: "Si ya no tienes este documento porque lo canjeaste, no pasa nada",
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "red-card-minor",
				label: "Tarjeta roja",
				hint: "Los datos deben ser legibles",
				required: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
			{
				id: "school-certificate-minor-asylum",
				label: "Certificado de escolaridad",
				hint: "Los datos deben ser legibles",
				required: true,
				multiple: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
		],
		asylumNo: [
			{
				id: "school-certificate-minor",
				label: "Certificado de escolaridad",
				hint: "Los datos deben ser legibles",
				required: true,
				multiple: true,
				accept: PDF_ONLY,
				maxSizeMB: 2,
			},
		],
	},
};

export const complementaryDocuments: Record<
	"adult" | "minor",
	ConditionalField[]
> = {
	adult: [
		{
			id: "complementary-april-2026",
			label: "Abril 2026",
			hint: "Ingresa toda la documentación que tengas de ese mes, ya sean citas médicas, facturas de compras o servicios a tu nombre o envíos de dinero.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "complementary-march-2026",
			label: "Marzo 2026",
			hint: "Ingresa toda la documentación que tengas de ese mes, ya sean citas médicas, facturas de compras o servicios a tu nombre o envíos de dinero.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "complementary-february-2026",
			label: "Febrero 2026",
			hint: "Ingresa toda la documentación que tengas de ese mes, ya sean citas médicas, facturas de compras o servicios a tu nombre o envíos de dinero.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "complementary-january-2026",
			label: "Enero 2026",
			hint: "Ingresa toda la documentación que tengas de ese mes, ya sean citas médicas, facturas de compras o servicios a tu nombre o envíos de dinero.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "complementary-december-2025",
			label: "Diciembre 2025",
			hint: "Ingresa toda la documentación que tengas de ese mes, ya sean citas médicas, facturas de compras o servicios a tu nombre o envíos de dinero.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "complementary-november-2025",
			label: "Noviembre 2025",
			hint: "Ingresa toda la documentación que tengas de ese mes, ya sean citas médicas, facturas de compras o servicios a tu nombre o envíos de dinero.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
	],
	minor: [
		{
			id: "guardian-documentation-minor",
			label: "Documentación de tus apoderados",
			hint: "Ingresa documentación de tus apoderados.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "guardian-authorization-minor",
			label: "Autorización de tus apoderados",
			hint: "Ingresa un documento firmado por tus apoderados donde aprueban que realices el trámite.",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
	],
};
