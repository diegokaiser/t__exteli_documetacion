"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAdminLogin } from "../hooks/use-admin-login";
import {
	AdminLoginInput,
	adminLoginSchema,
} from "../schemas/admin-login.schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md rounded-2xl">
				<CardHeader>
					<CardTitle>Admin Login</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<Label>Email</Label>
							<Input type="email" {...form.register("email")} />
							<p className="text-sm text-red-500">
								{form.formState.errors.email?.message}
							</p>
						</div>

						<div>
							<Label>Password</Label>
							<Input type="password" {...form.register("password")} />
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
							className="w-full"
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
