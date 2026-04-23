"use client";

import { AppShell } from "@/components/shared/app-shell";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Clock3, FileUp } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function DashboardView({
	onOpenWizard,
	onLogout,
}: {
	onOpenWizard: () => void;
	onLogout: () => void;
}) {
	return (
		<AppShell
			title="Mi expediente"
			subtitle="Consulta el estado actual de tu documentación y completa los archivos pendientes."
		>
			<div className="space-y-4 pb-20">
				<Card className="rounded-3xl border-0 shadow-lg">
					<CardContent className="p-5">
						<div className="flex items-center gap-3">
							<Avatar className="h-11 w-11">
								<AvatarFallback
									style={{ backgroundColor: colors.navy, color: "white" }}
								>
									CL
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-sm text-slate-500">Cliente</p>
								<p className="font-medium text-slate-900">cliente@correo.com</p>
							</div>
						</div>

						<Separator className="my-4" />

						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-2xl bg-slate-50 p-4">
								<p className="text-xs uppercase tracking-wide text-slate-500">
									Estado
								</p>
								<div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
									<Clock3 className="h-4 w-4" style={{ color: colors.navy }} />
									En progreso
								</div>
							</div>
							<div className="rounded-2xl bg-slate-50 p-4">
								<p className="text-xs uppercase tracking-wide text-slate-500">
									Documentos
								</p>
								<div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
									<FileUp className="h-4 w-4" style={{ color: colors.navy }} />6
									cargados
								</div>
							</div>
						</div>

						<div className="mt-4 rounded-2xl bg-slate-50 p-4">
							<div className="mb-2 flex items-center justify-between text-sm">
								<span className="font-medium text-slate-900">
									Progreso general
								</span>
								<span className="text-slate-500">65%</span>
							</div>
							<Progress value={65} className="h-2" />
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-3xl border-0 shadow-lg">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Pendientes prioritarios</CardTitle>
						<CardDescription>
							Completa estos archivos para avanzar con la revisión.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{[
							"Subir tarjeta de residencia",
							"Adjuntar nóminas del último trimestre",
							"Añadir documentos complementarios",
						].map((task) => (
							<div
								key={task}
								className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3"
							>
								<AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
								<p className="text-sm text-slate-700">{task}</p>
							</div>
						))}

						<Button
							className="mt-2 h-11 w-full rounded-2xl"
							style={{ backgroundColor: colors.navy, color: "white" }}
							onClick={onOpenWizard}
						>
							Completar documentación
						</Button>
					</CardContent>
				</Card>

				<MobileNav
					active="dashboard"
					onDashboard={() => undefined}
					onWizard={onOpenWizard}
					onLogout={onLogout}
				/>
			</div>
		</AppShell>
	);
}
