// src/features/admin/documents/document-package-rules.ts

export type DocumentPackageRule =
	| {
			mode: "single";
			requirementKey: string;
			outputName: string;
	  }
	| {
			mode: "merge-all";
			requirementKey: string;
			outputName: string;
	  }
	| {
			mode: "single-with-optional-apostille";
			requirementKey: string;
			apostilleRequirementKey: string;
			outputName: string;
			apostilledOutputName: string;
	  };

export const documentPackageRules: DocumentPackageRule[] = [
	{
		mode: "single",
		requirementKey: "passport-adult",
		outputName: "PASAPORTE",
	},
	{
		mode: "single",
		requirementKey: "passport-minor",
		outputName: "PASAPORTE",
	},
	{
		mode: "single-with-optional-apostille",
		requirementKey: "criminal-record",
		apostilleRequirementKey: "apostille-criminal-record",
		outputName: "ANTECEDENTES PENALES",
		apostilledOutputName: "ANTECEDENTES PENALES APOSTILLADOS",
	},
	{
		mode: "single",
		requirementKey: "individual-registration-adult",
		outputName: "EMPADRONAMIENTO INDIVIDUAL",
	},
	{
		mode: "single",
		requirementKey: "individual-registration-minor",
		outputName: "EMPADRONAMIENTO INDIVIDUAL",
	},
	{
		mode: "single",
		requirementKey: "historical-registration-adult",
		outputName: "EMPADRONAMIENTO HISTORICO",
	},
	{
		mode: "single",
		requirementKey: "historical-registration-minor",
		outputName: "EMPADRONAMIENTO HISTORICO",
	},
	{
		mode: "single",
		requirementKey: "collective-registration-minor",
		outputName: "EMPADRONAMIENTO COLECTIVO",
	},
	{
		mode: "single-with-optional-apostille",
		requirementKey: "birth-certificate",
		apostilleRequirementKey: "birth-certificate-apostille",
		outputName: "CERTIFICADO DE NACIMIENTO",
		apostilledOutputName: "CERTIFICADO DE NACIMIENTO APOSTILLADO",
	},
	{
		mode: "single",
		requirementKey: "white-letter-adult",
		outputName: "CARTA BLANCA",
	},
	{
		mode: "single",
		requirementKey: "white-letter-minor",
		outputName: "CARTA BLANCA",
	},
	{
		mode: "single",
		requirementKey: "red-card-adult",
		outputName: "TARJETA ROJA",
	},
	{
		mode: "single",
		requirementKey: "red-card-minor",
		outputName: "TARJETA ROJA",
	},
	{
		mode: "single",
		requirementKey: "working-life-adult-asylum",
		outputName: "VIDA LABORAL",
	},
	{
		mode: "single",
		requirementKey: "working-life-adult",
		outputName: "VIDA LABORAL",
	},
	{
		mode: "merge-all",
		requirementKey: "latest-payroll-adult-asylum",
		outputName: "ULTIMAS NOMINAS",
	},
	{
		mode: "single",
		requirementKey: "employment-contract-adult-asylum",
		outputName: "CONTRATO DE TRABAJO",
	},
	{
		mode: "merge-all",
		requirementKey: "school-certificate-minor-asylum",
		outputName: "CERTIFICADO DE ESCOLARIDAD",
	},
	{
		mode: "merge-all",
		requirementKey: "school-certificate-minor",
		outputName: "CERTIFICADO DE ESCOLARIDAD",
	},
	{
		mode: "merge-all",
		requirementKey: "complementary-april-2026",
		outputName: "ABRIL 2026",
	},
	{
		mode: "merge-all",
		requirementKey: "complementary-march-2026",
		outputName: "MARZO 2026",
	},
	{
		mode: "merge-all",
		requirementKey: "complementary-february-2026",
		outputName: "FEBRERO 2026",
	},
	{
		mode: "merge-all",
		requirementKey: "complementary-january-2026",
		outputName: "ENERO 2026",
	},
	{
		mode: "merge-all",
		requirementKey: "complementary-december-2025",
		outputName: "DICIEMBRE 2025",
	},
	{
		mode: "merge-all",
		requirementKey: "complementary-november-2025",
		outputName: "NOVIEMBRE 2025",
	},
	{
		mode: "merge-all",
		requirementKey: "guardian-documentation-minor",
		outputName: "DOCUMENTACION FAMILIAR",
	},
	{
		mode: "merge-all",
		requirementKey: "guardian-authorization-minor",
		outputName: "PERMISO DE APODERADO",
	},
	{
		mode: "single",
		requirementKey: "generated-representation",
		outputName: "REPRESENTACION",
	},
];
