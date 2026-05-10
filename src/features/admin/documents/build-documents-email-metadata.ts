type BuildDocumentsEmailMetadataParams = {
	sessionUser: {
		firstName?: string;
		fullName?: string;
		name?: string;
	};

	profile: {
		fullName: string;
	};

	caseDoc: {
		ageCategory?: "adult" | "minor";
	};

	assetsByRequirementKey: Record<string, unknown[]>;
};

function hasAsset(
	assetsByRequirementKey: Record<string, unknown[]>,
	key: string,
) {
	return (assetsByRequirementKey[key]?.length ?? 0) > 0;
}

function normalizeFilename(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9\s-_]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.toLowerCase();
}

export function buildDocumentsEmailMetadata({
	sessionUser,
	profile,
	caseDoc,
	assetsByRequirementKey,
}: BuildDocumentsEmailMetadataParams) {
	const gestor =
		sessionUser.firstName ??
		sessionUser.fullName?.split(" ")[0] ??
		sessionUser.name?.split(" ")[0] ??
		"GESTOR";

	const edad = caseDoc.ageCategory === "minor" ? "(MENOR)" : "";

	const hasWhiteLetter =
		hasAsset(assetsByRequirementKey, "white-letter-adult") ||
		hasAsset(assetsByRequirementKey, "white-letter-minor");

	const hasRedCard =
		hasAsset(assetsByRequirementKey, "red-card-adult") ||
		hasAsset(assetsByRequirementKey, "red-card-minor");

	const hasAsylumDocument = hasWhiteLetter || hasRedCard;

	const hasWorkingLifeAsylum = hasAsset(
		assetsByRequirementKey,
		"working-life-adult-asylum",
	);

	const hasPayrollAsylum = hasAsset(
		assetsByRequirementKey,
		"latest-payroll-adult-asylum",
	);

	const hasCollectiveRegistrationDescendants = hasAsset(
		assetsByRequirementKey,
		"collective-registration-descendants",
	);

	const hasVulnerability = hasAsset(
		assetsByRequirementKey,
		"vulnerability-report",
	);

	const tipo = hasAsylumDocument ? "(ASILO)" : "";

	let integracion = "";

	if (hasWorkingLifeAsylum && hasPayrollAsylum) {
		integracion = "(90 días)";
	}

	if (hasCollectiveRegistrationDescendants) {
		integracion = "(VIVE CON MENOR)";
	}

	if (hasVulnerability) {
		integracion = "(VULNERABILIDAD)";
	}

	const subject = [
		gestor.toUpperCase(),
		"RM",
		edad,
		tipo,
		integracion,
		profile.fullName.toUpperCase(),
	]
		.filter(Boolean)
		.join(" ");

	const zipFilename = `${normalizeFilename(profile.fullName)}-documentacion.zip`;

	return {
		subject,
		zipFilename,
	};
}
