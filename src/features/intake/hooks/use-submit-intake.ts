import { useMutation } from "@tanstack/react-query";
import type { WizardDraft } from "./use-wizard-draft";

export function useSubmitIntake() {
	return useMutation({
		mutationFn: async (draft: WizardDraft) => {
			const formData = new FormData();

			const fileFields: Record<string, string[]> = {};

			Object.entries(draft.files).forEach(([fieldId, files]) => {
				fileFields[fieldId] = [];

				files.forEach((file, index) => {
					const key = `${fieldId}-${index}`;
					fileFields[fieldId].push(key);
					formData.append(key, file);
				});
			});

			formData.append(
				"payload",
				JSON.stringify({
					age: draft.age,
					asylum: draft.asylum,
					skipped: draft.skipped,
					values: draft.values,
					fileFields,
				}),
			);

			const res = await fetch("/api/intake/submit", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message ?? "No se pudo enviar la documentación");
			}

			return res.json();
		},
	});
}
