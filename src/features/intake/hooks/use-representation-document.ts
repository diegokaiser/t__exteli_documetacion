"use client";

import { useQuery } from "@tanstack/react-query";

type RepresentationDocumentResponse = {
	exists: boolean;
	fileId: string | null;
	filename: string | null;
};

export function useRepresentationDocument() {
	return useQuery<RepresentationDocumentResponse>({
		queryKey: ["representation-document"],

		queryFn: async () => {
			const response = await fetch("/api/client/representation");

			if (!response.ok) {
				throw new Error("No se pudo cargar el documento");
			}

			return response.json();
		},
	});
}
