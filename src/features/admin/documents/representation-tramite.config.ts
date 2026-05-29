// src/features/admin/documents/representation-tramite.config.ts

export const representationTramiteByCaseName = {
	"regularizacion-masiva": "RESIDENCIA",
	"residencia-familiar-espanol": "ARRAIGO FAMILIAR POR VÍNCULO CON ESPAÑOL",
	"visa-estudios-origen": "VISA POR ESTUDIOS",
	"estancia-estudios": "ESTANCIA POR ESTUDIOS",
	"reagrupacion-familiar": "REAGRUPACIÓN FAMILIAR",
	"modificacion-residencia": "MODIFICACION RESIDENCIA",
} as const;

export function getRepresentationTramite(caseName?: string | null) {
	if (!caseName) return null;

	return (
		representationTramiteByCaseName[
			caseName as keyof typeof representationTramiteByCaseName
		] ?? null
	);
}
