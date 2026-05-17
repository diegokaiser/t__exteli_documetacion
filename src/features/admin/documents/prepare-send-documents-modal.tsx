"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	prepareDocumentsSchema,
	type PrepareDocumentsInput,
} from "./prepare-documents.schema";
import { usePrepareDocuments } from "./use-prepare-documents";

type PrepareSendDocumentsModalProps = {
	open: boolean;
	onClose: () => void;
	caseId: string;
	defaultValues: {
		email: string;
		phone?: string | null;
		asylumExp?: string | null;
	};
};

export function PrepareSendDocumentsModal({
	open,
	onClose,
	caseId,
	defaultValues,
}: PrepareSendDocumentsModalProps) {
	const mutation = usePrepareDocuments();

	const form = useForm<PrepareDocumentsInput>({
		resolver: zodResolver(prepareDocumentsSchema),
		defaultValues: {
			address: "",
			phone: defaultValues.phone ?? "",
			email: defaultValues.email,
			maritalStatus: "",
			fatherName: "",
			motherName: "",
			asylumExp: defaultValues.asylumExp ?? null,
		},
	});

	if (!open) return null;

	const onSubmit = form.handleSubmit((values) => {
		mutation.mutate(
			{
				caseId,
				payload: values,
			},
			{
				onSuccess: (data) => {
					console.log("[PREPARE_EMAIL_METADATA]", data);
					toast.success("Datos preparados correctamente");
					onClose();
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	});

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
			<div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
				<div className="mb-6 flex items-start justify-between gap-4">
					<div>
						<h2 className="text-lg font-semibold text-slate-900">
							Preparar envío
						</h2>
						<p className="text-sm text-slate-500">
							Completa los datos que irán en el cuerpo del correo.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<form onSubmit={onSubmit} className="space-y-5">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="md:col-span-2">
							<label className="text-sm font-medium text-slate-700">
								Dirección
							</label>
							<input
								{...form.register("address")}
								className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								placeholder="Dirección completa, Portal, Piso, Puerta, Codigo Postal, Ciudad"
							/>
							{form.formState.errors.address && (
								<p className="mt-1 text-sm text-red-500">
									{form.formState.errors.address.message}
								</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-slate-700">
								Teléfono
							</label>
							<input
								{...form.register("phone")}
								className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								placeholder="+34 600 000 000"
							/>
							{form.formState.errors.phone && (
								<p className="mt-1 text-sm text-red-500">
									{form.formState.errors.phone.message}
								</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-slate-700">
								Correo electrónico
							</label>
							<input
								{...form.register("email")}
								className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								placeholder="cliente@email.com"
							/>
							{form.formState.errors.email && (
								<p className="mt-1 text-sm text-red-500">
									{form.formState.errors.email.message}
								</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-slate-700">
								Estado civil
							</label>
							<input
								{...form.register("maritalStatus")}
								className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								placeholder="Soltero/a, casado/a..."
							/>
							{form.formState.errors.maritalStatus && (
								<p className="mt-1 text-sm text-red-500">
									{form.formState.errors.maritalStatus.message}
								</p>
							)}
						</div>

						{defaultValues.asylumExp != null && (
							<div>
								<label className="text-sm font-medium text-slate-700">
									EXP
								</label>
								<input
									{...form.register("asylumExp")}
									className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
									placeholder="Número EXP"
								/>
							</div>
						)}

						<div>
							<label className="text-sm font-medium text-slate-700">
								Nombre del padre
							</label>
							<input
								{...form.register("fatherName")}
								className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								placeholder="Nombre del padre"
							/>
							{form.formState.errors.fatherName && (
								<p className="mt-1 text-sm text-red-500">
									{form.formState.errors.fatherName.message}
								</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-slate-700">
								Nombre de la madre
							</label>
							<input
								{...form.register("motherName")}
								className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								placeholder="Nombre de la madre"
							/>
							{form.formState.errors.motherName && (
								<p className="mt-1 text-sm text-red-500">
									{form.formState.errors.motherName.message}
								</p>
							)}
						</div>
					</div>

					<div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
						<button
							type="button"
							onClick={onClose}
							className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
						>
							Cancelar
						</button>

						<button
							type="submit"
							disabled={mutation.isPending}
							className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{mutation.isPending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							Enviar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
