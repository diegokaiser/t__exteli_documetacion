import { useMutation } from "@tanstack/react-query";
import type { PrepareDocumentsInput } from "./prepare-documents.schema";

type PrepareDocumentsParams = {
	caseId: string;
	payload: PrepareDocumentsInput;
};

export function usePrepareDocuments() {
	return useMutation({
		mutationFn: async ({ caseId, payload }: PrepareDocumentsParams) => {
			const response = await fetch(
				`/api/admin/cases/${caseId}/prepare-and-send`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const error = await response.json().catch(() => null);
				throw new Error(error?.message ?? "No se pudo preparar el envío");
			}

			return response.json();
		},
	});
}
