import type {
	ConditionalField,
	FileConditionalField,
	TextConditionalField,
} from "@/features/intake/types/wizard.types";

export function isTextField(
	field: ConditionalField,
): field is TextConditionalField {
	return field.type === "text";
}

export function isFileField(
	field: ConditionalField,
): field is FileConditionalField {
	return field.type !== "text";
}
