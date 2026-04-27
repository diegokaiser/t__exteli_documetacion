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

async function parseResponse(res: Response) {
	const contentType = res.headers.get("content-type");

	if (contentType?.includes("application/json")) {
		return res.json();
	}

	return null;
}

export function useSubmitIntake() {
	return useMutation({
		mutationFn: async (draft: WizardDraft) => {
			let documents: UploadedIntakeDocument[];

			try {
				documents = await uploadIntakeFiles(draft);
			} catch (error) {
				console.error("[UPLOAD_INTAKE_FILES_ERROR]", error);
				throw new Error(
					error instanceof Error
						? error.message
						: "No se pudieron subir los archivos",
				);
			}

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

			const data = await parseResponse(res);

			if (!res.ok) {
				throw new Error(data?.message ?? "No se pudo enviar la documentación");
			}

			return data;
		},
	});
}
