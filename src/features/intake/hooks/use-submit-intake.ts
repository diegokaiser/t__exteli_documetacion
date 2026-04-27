import { useMutation } from "@tanstack/react-query";
import {
	uploadIntakeFiles,
	type UploadedIntakeDocument,
} from "../services/upload-intake-files";
import type { WizardDraft } from "./use-wizard-draft";

type SubmitIntakePayload = {
	age: WizardDraft["age"];
	asylum: WizardDraft["asylum"];
	skipped: WizardDraft["skipped"];
	values: WizardDraft["values"];
	documents: UploadedIntakeDocument[];
};

export function useSubmitIntake() {
	return useMutation({
		mutationFn: async (draft: WizardDraft) => {
			const documents = await uploadIntakeFiles(draft);

			const payload: SubmitIntakePayload = {
				age: draft.age,
				asylum: draft.asylum,
				skipped: draft.skipped,
				values: draft.values,
				documents,
			};

			const res = await fetch("/api/intake/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const contentType = res.headers.get("content-type");
			const data = contentType?.includes("application/json")
				? await res.json()
				: null;

			if (!res.ok) {
				throw new Error(data?.message ?? "No se pudo enviar la documentación");
			}

			return data;
		},
	});
}
