"use client";

import { AppShell } from "@/components/shared/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ShieldCheck } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function LoginForm({ onLogin }: { onLogin: () => void }) {
	return (
		<AppShell
			title="Acceso"
			subtitle="Inicia sesión con tu correo y contraseña para entrar al portal documental."
		>
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardHeader className="space-y-2 pb-4">
					<CardTitle className="text-xl">Iniciar sesión</CardTitle>
					<CardDescription>
						Usa las credenciales asociadas a tu expediente.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="email">Correo electrónico</Label>
						<div className="relative">
							<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								id="email"
								type="email"
								placeholder="cliente@correo.com"
								className="h-11 rounded-2xl border-slate-200 pl-10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Contraseña</Label>
							<button
								className="text-xs font-medium"
								style={{ color: colors.navy }}
							>
								¿Olvidaste tu contraseña?
							</button>
						</div>
						<div className="relative">
							<Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								className="h-11 rounded-2xl border-slate-200 pl-10"
							/>
						</div>
					</div>

					<Alert
						className="rounded-2xl border-0"
						style={{ backgroundColor: "rgba(13,59,102,0.06)" }}
					>
						<ShieldCheck className="h-4 w-4" style={{ color: colors.navy }} />
						<AlertTitle style={{ color: colors.navy }}>
							Acceso seguro
						</AlertTitle>
						<AlertDescription className="text-slate-600">
							Tus documentos se gestionan dentro de un entorno privado y con
							seguimiento por expediente.
						</AlertDescription>
					</Alert>

					<Button
						className="h-11 w-full rounded-2xl text-sm font-medium"
						style={{ backgroundColor: colors.navy, color: "white" }}
						onClick={onLogin}
					>
						Entrar
					</Button>
				</CardContent>
			</Card>
		</AppShell>
	);
}
