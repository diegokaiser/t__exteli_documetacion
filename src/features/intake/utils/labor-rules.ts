import { laborDocuments } from "@/features/intake/config/wizard.config";
import type {
	AsylumStatus,
	ConditionalField,
	PersonalAge,
} from "@/features/intake/types/wizard.types";

export const ADULT_NON_ASYLUM_IDS = [
	"working-life-adult",
	"precontract-adult",
	"collective-registration-descendants",
	"collective-registration-descendants-disability",
	"collective-registration-ascendants",
] as const;

export const DISABILITY_REGISTRATION_ID =
	"collective-registration-descendants-disability";

export const DISABILITY_CERTIFICATE_ID =
	"collective-certificate-descendants-disability";

export function getLaborBaseFields(
	age: PersonalAge,
	asylum: AsylumStatus,
): ConditionalField[] {
	if (!age) return [];

	if (age === "adult") {
		return asylum === "yes"
			? laborDocuments.adult.asylumYes
			: laborDocuments.adult.asylumNo;
	}

	return asylum === "yes"
		? laborDocuments.minor.asylumYes
		: laborDocuments.minor.asylumNo;
}

export function getVisibleLaborFields(
	age: PersonalAge,
	asylum: AsylumStatus,
	skipped: Record<string, boolean>,
): ConditionalField[] {
	const baseFields = getLaborBaseFields(age, asylum);
	const isAdultNonAsylumChain = age === "adult" && asylum === "no";

	if (!isAdultNonAsylumChain) return baseFields;

	return baseFields.filter((field) => {
		switch (field.id) {
			case "working-life-adult":
				return true;

			case "precontract-adult":
				return Boolean(skipped["working-life-adult"]);

			case "collective-registration-descendants":
				return Boolean(skipped["precontract-adult"]);

			case DISABILITY_REGISTRATION_ID:
			case DISABILITY_CERTIFICATE_ID:
				return Boolean(skipped["collective-registration-descendants"]);

			case "collective-registration-ascendants":
				return Boolean(skipped[DISABILITY_REGISTRATION_ID]);

			default:
				return true;
		}
	});
}

export function shouldShowVulnerability(
	age: PersonalAge,
	asylum: AsylumStatus,
	skipped: Record<string, boolean>,
) {
	return (
		age === "adult" &&
		asylum === "no" &&
		ADULT_NON_ASYLUM_IDS.every((id) => Boolean(skipped[id]))
	);
}

export function isEffectivelyRequiredLaborField(
	fieldId: string,
	age: PersonalAge,
	asylum: AsylumStatus,
	skipped: Record<string, boolean>,
) {
	if (fieldId === DISABILITY_CERTIFICATE_ID) {
		return !Boolean(skipped[DISABILITY_REGISTRATION_ID]);
	}

	const field = getLaborBaseFields(age, asylum).find(
		(item) => item.id === fieldId,
	);

	return Boolean(field?.required);
}

export function getNextSkippedStateForAdultNonAsylum(
	fieldId: string,
	currentSkipped: Record<string, boolean>,
) {
	const nextValue = !currentSkipped[fieldId];

	const nextSkipped = {
		...currentSkipped,
		[fieldId]: nextValue,
	};

	switch (fieldId) {
		case "working-life-adult":
			nextSkipped["precontract-adult"] = false;
			nextSkipped["collective-registration-descendants"] = false;
			nextSkipped[DISABILITY_REGISTRATION_ID] = false;
			nextSkipped["collective-registration-ascendants"] = false;
			return nextSkipped;

		case "precontract-adult":
			nextSkipped["collective-registration-descendants"] = false;
			nextSkipped[DISABILITY_REGISTRATION_ID] = false;
			nextSkipped["collective-registration-ascendants"] = false;
			return nextSkipped;

		case "collective-registration-descendants":
			nextSkipped[DISABILITY_REGISTRATION_ID] = false;
			nextSkipped["collective-registration-ascendants"] = false;
			return nextSkipped;

		case DISABILITY_REGISTRATION_ID:
			nextSkipped["collective-registration-ascendants"] = false;
			return nextSkipped;

		default:
			return nextSkipped;
	}
}

export function getFilesToClearForAdultNonAsylumToggle(
	fieldId: string,
	currentSkipped: Record<string, boolean>,
) {
	const nextValue = !currentSkipped[fieldId];

	if (fieldId === DISABILITY_REGISTRATION_ID) {
		return [
			DISABILITY_REGISTRATION_ID,
			DISABILITY_CERTIFICATE_ID,
			"collective-registration-ascendants",
		];
	}

	if (nextValue) {
		return [fieldId];
	}

	switch (fieldId) {
		case "working-life-adult":
			return [
				"working-life-adult",
				"precontract-adult",
				"collective-registration-descendants",
				DISABILITY_REGISTRATION_ID,
				DISABILITY_CERTIFICATE_ID,
				"collective-registration-ascendants",
			];

		case "precontract-adult":
			return [
				"precontract-adult",
				"collective-registration-descendants",
				DISABILITY_REGISTRATION_ID,
				DISABILITY_CERTIFICATE_ID,
				"collective-registration-ascendants",
			];

		case "collective-registration-descendants":
			return [
				"collective-registration-descendants",
				DISABILITY_REGISTRATION_ID,
				DISABILITY_CERTIFICATE_ID,
				"collective-registration-ascendants",
			];

		default:
			return [fieldId];
	}
}
