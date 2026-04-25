export type PersonalAge = "adult" | "minor" | null;
export type AsylumStatus = "yes" | "no" | null;

export type BaseConditionalField = {
	id: string;
	label: string;
	hint?: string;
	required?: boolean;
};

export type FileConditionalField = BaseConditionalField & {
	type?: "file";
	multiple?: boolean;
	optionalToggle?: string;
	accept?: string[];
	maxSizeMB?: number;
};

export type TextConditionalField = BaseConditionalField & {
	type: "text";
	inputMode?: "numeric" | "text";
	maxLength?: number;
	pattern?: RegExp;
};

export type ConditionalField = FileConditionalField | TextConditionalField;
