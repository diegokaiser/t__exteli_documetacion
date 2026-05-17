"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRepresentationDocument } from "@/features/intake/hooks/use-representation-document";
import { Loader2 } from "lucide-react";

export function WizardRepresentation() {
	const { data, isLoading } = useRepresentationDocument();

	if (isLoading) {
		return (
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardContent className="flex items-center justify-center py-10">
					<Loader2 className="h-5 w-5 animate-spin" />
				</CardContent>
			</Card>
		);
	}

	if (!data?.exists) return null;

	return (
		<Card className="rounded-3xl border-0 shadow-lg">
			<CardContent className="space-y-4 px-5 py-1">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-slate-900">
						Documento de representación
					</h3>

					<p className="text-sm text-slate-600">
						Antes de continuar, descarga el documento de representación, fírmalo
						y posteriormente súbelo junto a tu documentación.
					</p>
				</div>

				<a
					href={`/api/client/files/${data.fileId}/download`}
					className="inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
				>
					Descargar documento
				</a>
			</CardContent>
		</Card>
	);
}
