"use client";

import { AppShell } from "@/components/shared/app-shell";
import { SplashLoader } from "@/components/shared/splash-loader";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const colors = {
	navy: "#0D3B66",
};

export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	async function handleLogin() {
		try {
			setIsLoggingIn(true);

			const res = await fetch("/api/auth/client-login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				setIsLoggingIn(false);
				return;
			}

			router.replace("/app");
			router.refresh();
		} catch {
			setIsLoggingIn(false);
		}
	}

	if (isLoggingIn) {
		return <SplashLoader message="Iniciando sesión..." />;
	}

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
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Contraseña</Label>
						<div className="relative">
							<Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								className="h-11 rounded-2xl border-slate-200 pl-10"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
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
						type="button"
						disabled={isLoggingIn}
						className="cursor-pointer h-11 w-full rounded-2xl text-sm font-medium"
						style={{ backgroundColor: colors.navy, color: "white" }}
						onClick={handleLogin}
					>
						Entrar
					</Button>
				</CardContent>
			</Card>
		</AppShell>
	);
}
