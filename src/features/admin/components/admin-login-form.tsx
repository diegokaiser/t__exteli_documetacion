"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAdminLogin } from "../hooks/use-admin-login";
import {
	AdminLoginInput,
	adminLoginSchema,
} from "../schemas/admin-login.schema";

import { AppShell } from "@/components/shared/app-shell";
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
import { Lock, Mail } from "lucide-react";

export function AdminLoginForm() {
	const router = useRouter();
	const loginMutation = useAdminLogin();

	const form = useForm<AdminLoginInput>({
		resolver: zodResolver(adminLoginSchema),
	});

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			await loginMutation.mutateAsync(values);
			window.location.assign("/admin");
		} catch (error: any) {
			form.setError("root", {
				message: error.message,
			});
		}
	});

	return (
		<AppShell
			title="Acceso"
			subtitle="Inicia sesión con tu correo y contraseña para entrar al portal documental."
		>
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardHeader className="space-y-2 pb-4">
					<CardTitle className="text-xl">Iniciar sesión</CardTitle>
					<CardDescription>
						Usa las credenciales asociadas a tu usuario.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-5">
					<form onSubmit={onSubmit}>
						<div className="space-y-2">
							<Label htmlFor="email">Correo electrónico</Label>
							<div className="relative">
								<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="email"
									type="email"
									placeholder="admin@correo.com"
									className="h-11 rounded-2xl border-slate-200 pl-10"
									{...form.register("email")}
								/>
							</div>
							<p className="text-sm text-red-500">
								{form.formState.errors.email?.message}
							</p>
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
									{...form.register("password")}
								/>
							</div>
							<p className="text-sm text-red-500">
								{form.formState.errors.password?.message}
							</p>
						</div>

						{form.formState.errors.root && (
							<p className="text-sm text-red-500">
								{form.formState.errors.root.message}
							</p>
						)}

						<Button
							type="submit"
							className="h-11 w-full rounded-2xl text-sm font-medium cursor-pointer"
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</AppShell>
	);
}
