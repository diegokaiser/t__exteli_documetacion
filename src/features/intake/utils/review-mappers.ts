import {
	complementaryDocuments,
	laborDocuments,
	personalDocuments,
} from "@/features/intake/config/wizard.config";
import type { WizardDraft } from "@/features/intake/hooks/use-wizard-draft";
import type { ConditionalField } from "@/features/intake/types/wizard.types";
import {
	getVisibleLaborFields,
	isEffectivelyRequiredLaborField,
	shouldShowVulnerability,
} from "@/features/intake/utils/labor-rules";

export type ReviewItem = {
	id: string;
	label: string;
	required?: boolean;
	skipped?: boolean;
	filesCount: number;
	fileNames: string[];
	value?: string;
	type?: "file" | "text";
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
		value: field.type === "text" ? (draft.values[field.id] ?? "") : undefined,
		type: field.type ?? "file",
	};
}

function mapLaborField(
	field: ConditionalField,
	draft: WizardDraft,
): ReviewItem {
	const files = draft.files[field.id] ?? [];
	const skipped = Boolean(draft.skipped[field.id]);

	return {
		id: field.id,
		label: field.label,
		required: isEffectivelyRequiredLaborField(
			field.id,
			draft.age,
			draft.asylum,
			draft.skipped,
		),
		skipped,
		filesCount: files.length,
		fileNames: files.map((file) => file.name),
		value: field.type === "text" ? (draft.values[field.id] ?? "") : undefined,
		type: field.type ?? "file",
	};
}

export function buildReviewSections(draft: WizardDraft): ReviewSectionData[] {
	if (!draft.age) return [];

	const personal = personalDocuments[draft.age].map((field) =>
		mapField(field, draft),
	);

	const labor = getVisibleLaborFields(
		draft.age,
		draft.asylum,
		draft.skipped,
	).map((field) => mapLaborField(field, draft));

	const laborItems = shouldShowVulnerability(
		draft.age,
		draft.asylum,
		draft.skipped,
	)
		? [...labor, mapLaborField(laborDocuments.adult.vulnerability, draft)]
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
		section.items.some((item) => {
			if (!item.required || item.skipped) return false;

			if (item.type === "text") {
				return !item.value?.trim();
			}

			return item.filesCount === 0;
		}),
	);
}
