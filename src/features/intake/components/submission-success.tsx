"use client";

import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWizardDraft } from "@/features/intake/hooks/use-wizard-draft";
import { CheckCircle2 } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function SubmissionSuccess({
	onGoDashboard,
}: {
	onGoDashboard: () => void;
}) {
	const { draft, resetDraft } = useWizardDraft();

	return (
		<AppShell
			title="Envío completado"
			subtitle="Tu documentación ha sido registrada correctamente y pasará al proceso de revisión."
		>
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardContent className="flex flex-col items-center p-6 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
						<CheckCircle2 className="h-8 w-8 text-emerald-600" />
					</div>

					<h2 className="mt-5 text-xl font-semibold text-slate-900">
						Documentos enviados con éxito
					</h2>
					<p className="mt-2 text-sm leading-6 text-slate-600">
						Hemos recibido tu documentación. Nuestro equipo la revisará y te
						notificará si es necesario aportar algo adicional.
					</p>

					{draft.submittedAt ? (
						<div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
							Fecha de envío:{" "}
							{new Date(draft.submittedAt).toLocaleString("es-ES")}
						</div>
					) : null}

					<Button
						className="mt-6 h-11 w-full rounded-2xl"
						style={{ backgroundColor: colors.navy, color: "white" }}
						onClick={() => {
							resetDraft();
							onGoDashboard();
						}}
					>
						Volver al dashboard
					</Button>
				</CardContent>
			</Card>
		</AppShell>
	);
}
