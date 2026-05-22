export const casesNames = [
	{
		label: "Regularizacion Masiva 2026",
		value: "regularizacion-masiva",
	},
	{
		label: "Residencia por Familiar Español",
		value: "residencia-familiar-espanol",
	},
	{
		label: "Visa de Estudios (País de origen)",
		value: "visa-estudios-origen",
	},
	{
		label: "Estancia de estudios",
		value: "estancia-estudios",
	},
	{
		label: "Reagrupación Familiar",
		value: "reagrupacion-familiar",
	},
	{
		label: "Modificación de Residencia",
		value: "modificacion-residencia",
	},
	{
		label: "Canje de licencia",
		value: "canje-licencia",
	},
] as const;

export const allowedCasesNames = casesNames.map((name) => name.value);
