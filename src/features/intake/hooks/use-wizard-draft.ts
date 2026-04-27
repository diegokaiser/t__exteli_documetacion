"use client";

import type {
	AsylumStatus,
	PersonalAge,
} from "@/features/intake/types/wizard.types";
import { useMemo, useState } from "react";

export type WizardDraft = {
	age: PersonalAge;
	asylum: AsylumStatus;
	skipped: Record<string, boolean>;
	files: Record<string, File[]>;
	values: Record<string, string>;
	submittedAt?: string;
};

const defaultDraft: WizardDraft = {
	age: "adult",
	asylum: "no",
	skipped: {
		"working-life-adult": false,
		"precontract-adult": false,
		"collective-registration-descendants": false,
		"collective-registration-descendants-disability": false,
		"collective-certificate-descendants-disability": false,
		"collective-registration-ascendants": false,
	},
	files: {},
	values: {},
};

export function useWizardDraft() {
	const [draft, setDraft] = useState<WizardDraft>(defaultDraft);

	const actions = useMemo(
		() => ({
			setAge: (age: PersonalAge) => {
				setDraft((prev) => ({ ...prev, age }));
			},

			setAsylum: (asylum: AsylumStatus) => {
				setDraft((prev) => ({ ...prev, asylum }));
			},

			setSkipped: (nextSkipped: Record<string, boolean>) => {
				setDraft((prev) => ({
					...prev,
					skipped: {
						...prev.skipped,
						...nextSkipped,
					},
				}));
			},

			setFiles: (fieldId: string, files: FileList | null) => {
				const normalized = files ? Array.from(files) : [];

				setDraft((prev) => ({
					...prev,
					files: {
						...prev.files,
						[fieldId]: normalized,
					},
				}));
			},

			clearFile: (fieldId: string) => {
				setDraft((prev) => ({
					...prev,
					files: {
						...prev.files,
						[fieldId]: [],
					},
				}));
			},

			clearFiles: (fieldIds: string[]) => {
				setDraft((prev) => {
					const nextFiles = { ...prev.files };

					fieldIds.forEach((fieldId) => {
						nextFiles[fieldId] = [];
					});

					return {
						...prev,
						files: nextFiles,
					};
				});
			},

			removeFile: (fieldId: string, index: number) => {
				setDraft((prev) => {
					const currentFiles = prev.files[fieldId] ?? [];

					return {
						...prev,
						files: {
							...prev.files,
							[fieldId]: currentFiles.filter((_, i) => i !== index),
						},
					};
				});
			},

			setValue: (fieldId: string, value: string) => {
				setDraft((prev) => ({
					...prev,
					values: {
						...prev.values,
						[fieldId]: value,
					},
				}));
			},

			clearValue: (fieldId: string) => {
				setDraft((prev) => ({
					...prev,
					values: {
						...prev.values,
						[fieldId]: "",
					},
				}));
			},

			markSubmitted: () => {
				setDraft((prev) => ({
					...prev,
					submittedAt: new Date().toISOString(),
				}));
			},

			resetDraft: () => {
				setDraft(defaultDraft);
			},
		}),
		[],
	);

	return {
		draft,
		...actions,
	};
}
