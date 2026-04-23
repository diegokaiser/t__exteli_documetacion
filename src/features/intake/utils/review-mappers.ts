import {
	complementaryDocuments,
	laborDocuments,
	personalDocuments,
} from "@/features/intake/config/wizard.config";
import type { WizardDraft } from "@/features/intake/hooks/use-wizard-draft";
import type { ConditionalField } from "@/features/intake/types/wizard.types";

export type ReviewItem = {
	id: string;
	label: string;
	required?: boolean;
	skipped?: boolean;
	filesCount: number;
	fileNames: string[];
};

export type ReviewSectionData = {
	id: string;
	title: string;
	items: ReviewItem[];
};

function mapField(field: ConditionalField, draft: WizardDraft): ReviewItem {
	const files = draft.files[field.id] ?? [];
	const skipped = Boolean(draft.skipped[field.id]);

	return {
		id: field.id,
		label: field.label,
		required: field.required,
		skipped,
		filesCount: files.length,
		fileNames: files.map((file) => file.name),
	};
}

export function buildReviewSections(draft: WizardDraft): ReviewSectionData[] {
	if (!draft.age) return [];

	const personal = personalDocuments[draft.age].map((field) =>
		mapField(field, draft),
	);

	const laborBase =
		draft.age === "adult"
			? draft.asylum === "yes"
				? laborDocuments.adult.asylumYes
				: laborDocuments.adult.asylumNo
			: draft.asylum === "yes"
				? laborDocuments.minor.asylumYes
				: laborDocuments.minor.asylumNo;

	const labor = laborBase.map((field) => mapField(field, draft));

	const shouldShowVulnerability =
		draft.age === "adult" &&
		draft.asylum === "no" &&
		[
			"working-life-adult",
			"precontract-adult",
			"collective-registration-descendants",
			"collective-registration-ascendants",
		].every((id) => draft.skipped[id]);

	const laborItems = shouldShowVulnerability
		? [...labor, mapField(laborDocuments.adult.vulnerability, draft)]
		: labor;

	const complementary = complementaryDocuments[draft.age].map((field) =>
		mapField(field, draft),
	);

	return [
		{
			id: "personal",
			title: "Datos personales",
			items: personal,
		},
		{
			id: "labor",
			title: "Datos laborales o de integración",
			items: laborItems,
		},
		{
			id: "complementary",
			title: "Datos complementarios",
			items: complementary,
		},
	];
}

export function hasMissingRequiredDocuments(sections: ReviewSectionData[]) {
	return sections.some((section) =>
		section.items.some(
			(item) => item.required && !item.skipped && item.filesCount === 0,
		),
	);
}
