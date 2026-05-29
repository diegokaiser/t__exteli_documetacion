"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { casesNames } from "../cases/cases-names";
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
			caseName: undefined,
			age: "adult",
			genre: "female",
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			documentType: undefined,
			documentNumber: "",
			guardianFirstName: "",
			guardianLastName: "",
			guardianGenre: "female",
			guardianDocumentType: undefined,
			guardianDocumentNumber: "",
		},
	});

	const age = form.watch("age");
	const isSubmitting = mutation.isPending || form.formState.isSubmitting;

	const onSubmit = form.handleSubmit((values) => {
		mutation.mutate(values, {
			onSuccess: (data) => {
				form.reset();

				if (data.inviteSent) {
					toast.success("Cliente creado correctamente y confirmación enviada.");
				} else {
					toast.warning(
						"Cliente creado correctamente. No se envió confirmación, validar manualmente.",
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
				<div className="flex flex-wrap gap-4">
					<div className="w-full sm:w-[calc(50%-12px)]">
						<AdminFormField
							label="Trámite"
							error={form.formState.errors.caseName?.message}
						>
							<select
								{...form.register("caseName")}
								disabled={isSubmitting}
								className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
							>
								{casesNames.map((name) => (
									<option key={name.value} value={name.value}>
										{name.label}
									</option>
								))}
							</select>
						</AdminFormField>
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
						<AdminFormField
							label="Edad"
							error={form.formState.errors.age?.message}
						>
							<select
								{...form.register("age")}
								disabled={isSubmitting}
								className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
							>
								<option value="adult">Adulto</option>
								<option value="minor">Menor</option>
							</select>
						</AdminFormField>
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
						<AdminFormField
							label="Género"
							error={form.formState.errors.genre?.message}
						>
							<select
								{...form.register("genre")}
								disabled={isSubmitting}
								className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
							>
								<option value="female">Mujer</option>
								<option value="male">Hombre</option>
							</select>
						</AdminFormField>
					</div>

					{age === "minor" && (
						<div className="mt-6 w-full">
							<AdminCard title="Datos del apoderado" type="sub">
								<div className="grid gap-6 lg:grid-cols-2">
									<AdminFormField
										label="Género"
										error={form.formState.errors.guardianGenre?.message}
									>
										<select
											{...form.register("guardianGenre")}
											disabled={isSubmitting}
											className="h-11 w-full rounded-lg border border-slate-400 px-3 text-sm bg-white"
										>
											<option value="female">Mujer</option>
											<option value="male">Hombre</option>
										</select>
									</AdminFormField>

									<AdminFormField
										label="Nombre"
										error={form.formState.errors.guardianFirstName?.message}
									>
										<input
											{...form.register("guardianFirstName")}
											disabled={isSubmitting}
											placeholder="Ej. María"
											className="h-11 w-full rounded-lg border border-slate-400 px-3 text-sm bg-white"
										/>
									</AdminFormField>

									<AdminFormField
										label="Apellidos"
										error={form.formState.errors.guardianLastName?.message}
									>
										<input
											{...form.register("guardianLastName")}
											disabled={isSubmitting}
											placeholder="Ej. López García"
											className="h-11 w-full rounded-lg border border-slate-400 px-3 text-sm bg-white"
										/>
									</AdminFormField>

									<AdminFormField
										label="Tipo documento"
										error={form.formState.errors.guardianDocumentType?.message}
									>
										<select
											{...form.register("guardianDocumentType")}
											disabled={isSubmitting}
											className="h-11 w-full rounded-lg border border-slate-400 px-3 text-sm bg-white"
										>
											<option value="">Seleccionar</option>
											<option value="pasaporte">Pasaporte</option>
											<option value="nie">NIE</option>
										</select>
									</AdminFormField>

									<AdminFormField
										label="Número documento"
										error={
											form.formState.errors.guardianDocumentNumber?.message
										}
									>
										<input
											{...form.register("guardianDocumentNumber")}
											disabled={isSubmitting}
											placeholder="Documento del apoderado"
											className="h-11 w-full rounded-lg border border-slate-400 px-3 text-sm bg-white"
										/>
									</AdminFormField>
								</div>
							</AdminCard>
						</div>
					)}

					<div className="w-full sm:w-[calc(50%-12px)]">
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
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
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
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
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
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
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
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
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
					</div>

					<div className="w-full sm:w-[calc(50%-12px)]">
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
				</div>
			</AdminCard>

			<div className="mt-8">
				<button
					type="submit"
					disabled={isSubmitting}
					className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
					{isSubmitting ? "Creando..." : "Crear cliente"}
				</button>
			</div>
		</form>
	);
}
