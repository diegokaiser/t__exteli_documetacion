"use client";

import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewSection } from "@/features/intake/components/review-section";
import { useWizardDraft } from "@/features/intake/hooks/use-wizard-draft";
import {
	buildReviewSections,
	hasMissingRequiredDocuments,
} from "@/features/intake/utils/review-mappers";
import { AlertTriangle } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function WizardReviewView({
	onBack,
	onConfirm,
}: {
	onBack: () => void;
	onConfirm: () => void;
}) {
	const { draft, markSubmitted } = useWizardDraft();
	const sections = buildReviewSections(draft);
	const hasMissingRequired = hasMissingRequiredDocuments(sections);

	return (
		<AppShell
			title="Revisar documentos"
			subtitle="Confirma los archivos antes de enviar tu documentación para revisión."
			showBack
			onBack={onBack}
		>
			<div className="space-y-4 pb-8">
				{hasMissingRequired ? (
					<Card className="rounded-3xl border-0 bg-amber-50 shadow-none">
						<CardContent className="flex items-start gap-3 p-4 text-amber-900">
							<AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
							<div>
								<p className="text-sm font-medium">
									Faltan documentos obligatorios
								</p>
								<p className="mt-1 text-sm text-amber-800">
									Revisa los elementos marcados como pendientes antes de
									confirmar el envío.
								</p>
							</div>
						</CardContent>
					</Card>
				) : null}

				{sections.map((section) => (
					<ReviewSection key={section.id} section={section} />
				))}

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<Button
						variant="outline"
						className="h-11 rounded-2xl cursor-pointer"
						onClick={onBack}
					>
						Volver a editar
					</Button>
					<Button
						className="h-11 rounded-2xl cursor-pointer"
						style={{ backgroundColor: colors.navy, color: "white" }}
						disabled={hasMissingRequired}
						onClick={() => {
							markSubmitted();
							onConfirm();
						}}
					>
						Confirmar envío
					</Button>
				</div>
			</div>
		</AppShell>
	);
}
