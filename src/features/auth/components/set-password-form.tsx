"use client";

import { AppShell } from "@/components/shared/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const colors = {
	navy: "#0D3B66",
};

const schema = z
	.object({
		password: z.string().min(8, "Mínimo 8 caracteres"),
		confirmPassword: z.string().min(8, "Confirma tu contraseña"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Las contraseñas no coinciden",
	});

type FormValues = z.infer<typeof schema>;

type SetPasswordFormProps = {
	userId?: string;
	secret?: string;
};

export function SetPasswordForm({ userId, secret }: SetPasswordFormProps) {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		setServerError(null);

		if (!userId || !secret) {
			setServerError("El enlace no es válido o ha expirado.");
			return;
		}

		const response = await fetch("/api/auth/set-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				secret,
				password: values.password,
			}),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => null);
			setServerError(error?.message ?? "No se pudo crear la contraseña");
			return;
		}

		router.push("/login?passwordCreated=true");
	});

	return (
		<AppShell
			title="Crea tu contraseña"
			subtitle="Define una contraseña segura para acceder a tu portal."
		>
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<form onSubmit={onSubmit} className="space-y-5">
							<div>
								<label className="text-sm font-medium text-slate-700">
									Contraseña
								</label>
								<input
									type="password"
									{...form.register("password")}
									className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								/>
								{form.formState.errors.password && (
									<p className="mt-1 text-sm text-red-500">
										{form.formState.errors.password.message}
									</p>
								)}
							</div>

							<div>
								<label className="text-sm font-medium text-slate-700">
									Confirmar contraseña
								</label>
								<input
									type="password"
									{...form.register("confirmPassword")}
									className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								/>
								{form.formState.errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-500">
										{form.formState.errors.confirmPassword.message}
									</p>
								)}
							</div>

							{serverError && (
								<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
									{serverError}
								</p>
							)}

							<button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="cursor-pointer h-11 w-full rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
							>
								{form.formState.isSubmitting
									? "Creando contraseña..."
									: "Crear contraseña"}
							</button>
						</form>
					</div>
				</CardContent>
			</Card>
		</AppShell>
	);
}
