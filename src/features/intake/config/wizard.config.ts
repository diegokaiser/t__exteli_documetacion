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
				required: true,
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
			id: "medical-appointments-adult",
			label: "Citas médicas",
			hint: "Los datos deben ser legibles",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 6,
		},
		{
			id: "utilities-bills-adult",
			label: "Facturas de servicios",
			hint: "Los datos deben ser legibles",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 6,
		},
		{
			id: "transport-pass-history-adult",
			label: "Historial de recargas de bono transporte",
			hint: "Puedes obtenerlo en Nuevos Ministerios o con una cita",
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "bank-ownership-certificate",
			label: "Certificado de titularidad del banco",
			hint: "Los datos deben ser legibles",
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "bank-movements-history",
			label: "Historial de movimientos bancarios",
			hint: "Los datos deben ser legibles",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 4,
		},
		{
			id: "courses-certificates-adult",
			label: "Cursos y certificados",
			hint: "Los datos deben ser legibles",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 6,
		},
		{
			id: "rental-contract",
			label: "Contrato de alquiler",
			hint: "Los datos deben ser legibles",
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
	],
	minor: [
		{
			id: "medical-appointments-minor",
			label: "Citas médicas",
			hint: "Los datos deben ser legibles",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 6,
		},
		{
			id: "transport-pass-history-minor",
			label: "Historial de recargas de bono transporte",
			hint: "Los datos deben ser legibles",
			accept: PDF_ONLY,
			maxSizeMB: 2,
		},
		{
			id: "courses-certificates-minor",
			label: "Cursos y certificados",
			hint: "Los datos deben ser legibles",
			multiple: true,
			accept: PDF_ONLY,
			maxSizeMB: 6,
		},
	],
};
