"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AdminCard } from "../components/admin-card";
import { AdminFormField } from "../components/admin-form-field";
import {
	createClientSchema,
	type CreateClientInput,
} from "./create-client.schema";
import { useCreateClient } from "./use-create-client";

export function CreateClientForm() {
	const router = useRouter();
	const mutation = useCreateClient();

	const form = useForm<CreateClientInput>({
		resolver: zodResolver(createClientSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			documentType: undefined,
			documentNumber: "",
		},
	});

	const isSubmitting = mutation.isPending || form.formState.isSubmitting;

	const onSubmit = form.handleSubmit((values) => {
		mutation.mutate(values, {
			onSuccess: (data) => {
				form.reset();

				if (data.inviteSent) {
					toast.success("Cliente creado correctamente y confirmación enviada.");
				} else {
					toast.warning(
						"Cliente creado correctamente. No se envio confirmación, validar manualmente.",
					);
				}

				setTimeout(() => {
					router.push("/admin/clients");
				}, 1200);
			},

			onError: (error) => {
				toast.error(error.message || "Error al crear el cliente");
			},
		});
	});

	return (
		<form onSubmit={onSubmit}>
			<AdminCard title="Datos del cliente">
				<div className="grid gap-6 lg:grid-cols-2">
					<AdminFormField
						label="Nombre"
						error={form.formState.errors.firstName?.message}
					>
						<input
							{...form.register("firstName")}
							disabled={isSubmitting}
							placeholder="Ej. Juan Carlos"
							className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
						/>
					</AdminFormField>

					<AdminFormField
						label="Apellidos"
						error={form.formState.errors.lastName?.message}
					>
						<input
							{...form.register("lastName")}
							disabled={isSubmitting}
							placeholder="Ej. Pérez García"
							className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
						/>
					</AdminFormField>

					<AdminFormField
						label="Email"
						error={form.formState.errors.email?.message}
					>
						<input
							{...form.register("email")}
							disabled={isSubmitting}
							placeholder="cliente@email.com"
							className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
						/>
					</AdminFormField>

					<AdminFormField
						label="Teléfono"
						error={form.formState.errors.phone?.message}
					>
						<input
							{...form.register("phone")}
							disabled={isSubmitting}
							placeholder="+34 600 000 000"
							className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
						/>
					</AdminFormField>

					<AdminFormField
						label="Tipo documento"
						error={form.formState.errors.documentType?.message}
					>
						<select
							{...form.register("documentType")}
							disabled={isSubmitting}
							className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
						>
							<option value="">Seleccionar</option>
							<option value="pasaporte">Pasaporte</option>
							<option value="nie">NIE</option>
						</select>
					</AdminFormField>

					<AdminFormField
						label="Número documento"
						error={form.formState.errors.documentNumber?.message}
					>
						<input
							{...form.register("documentNumber")}
							disabled={isSubmitting}
							placeholder="Documento"
							className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
						/>
					</AdminFormField>
				</div>

				<div className="mt-8">
					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
					>
						{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
						{isSubmitting ? "Creando..." : "Crear cliente"}
					</button>
				</div>
			</AdminCard>
		</form>
	);
}
