export type PersonalAge = "adult" | "minor" | null;
export type AsylumStatus = "yes" | "no" | null;

export type ConditionalField = {
	id: string;
	label: string;
	hint: string;
	required?: boolean;
	multiple?: boolean;
	optionalToggle?: string;
	accept?: string[];
	maxSizeMB?: number;
};
