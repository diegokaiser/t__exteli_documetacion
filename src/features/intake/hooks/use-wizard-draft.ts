"use client";

import type {
	AsylumStatus,
	PersonalAge,
} from "@/features/intake/types/wizard.types";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "wizard-draft";

export type UploadedFileItem = {
	name: string;
	size?: number;
	type?: string;
};

export type WizardDraft = {
	age: PersonalAge;
	asylum: AsylumStatus;
	skipped: Record<string, boolean>;
	files: Record<string, UploadedFileItem[]>;
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
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		try {
			const raw = window.sessionStorage.getItem(STORAGE_KEY);

			if (raw) {
				const parsed = JSON.parse(raw);

				setDraft({
					...defaultDraft,
					...parsed,
					skipped: {
						...defaultDraft.skipped,
						...(parsed.skipped ?? {}),
					},
					files: parsed.files ?? {},
					values: parsed.values ?? {},
				});
			}
		} catch {
			setDraft(defaultDraft);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (!isLoaded) return;

		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
	}, [draft, isLoaded]);

	const actions = useMemo(
		() => ({
			setAge: (age: PersonalAge) => {
				setDraft((prev) => ({
					...prev,
					age,
				}));
			},

			setAsylum: (asylum: AsylumStatus) => {
				setDraft((prev) => ({
					...prev,
					asylum,
				}));
			},

			setSkip: (fieldId: string, value: boolean) => {
				setDraft((prev) => ({
					...prev,
					skipped: {
						...prev.skipped,
						[fieldId]: value,
					},
				}));
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
				const normalized = files
					? Array.from(files).map((file) => ({
							name: file.name,
							size: file.size,
							type: file.type,
						}))
					: [];

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
							[fieldId]: currentFiles.filter(
								(_, currentIndex) => currentIndex !== index,
							),
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
				window.sessionStorage.removeItem(STORAGE_KEY);
			},
		}),
		[],
	);

	return {
		draft,
		isLoaded,
		...actions,
	};
}
