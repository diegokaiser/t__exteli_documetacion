"use client";

import { Loader2, Mail, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAdminClients } from "./use-admin-clients";
import { useResendClientInvite } from "./use-resend-client-invite";

export function ClientsTable() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [procedure, setProcedure] = useState("all");
	const [verification, setVerification] = useState("all");

	const { data = [], isLoading, isError } = useAdminClients();
	const resendInvite = useResendClientInvite();

	const clients = useMemo(() => {
		return data.filter((client) => {
			const matchesSearch =
				client.fullName.toLowerCase().includes(search.toLowerCase()) ||
				client.email.toLowerCase().includes(search.toLowerCase()) ||
				client.documentNumber?.toLowerCase().includes(search.toLowerCase());

			const matchesStatus = status === "all" || client.status === status;

			const matchesVerification =
				verification === "all" ||
				(verification === "verified" && client.emailVerification) ||
				(verification === "unverified" && !client.emailVerification);

			return matchesSearch && matchesStatus && matchesVerification;
		});
	}, [data, search, status, verification]);

	const handleResendInvite = (userId: string) => {
		resendInvite.mutate(userId, {
			onSuccess: () => {
				toast.success("Invitación reenviada correctamente");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
				<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
				No se pudieron cargar los clientes.
			</div>
		);
	}

	console.log(clients);

	return (
		<section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="border-b border-slate-100 p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div></div>

					<Link
						href="/admin/clients/new"
						className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
					>
						Crear cliente
					</Link>
				</div>

				<div className="mt-6 grid gap-3 lg:grid-cols-[1fr_180px_220px]">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Buscar por nombre, email o documento..."
							className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
						/>
					</div>

					<select
						value={status}
						onChange={(event) => setStatus(event.target.value)}
						className="h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					>
						<option value="all">Todos los estados</option>
						<option value="sent">Enviado</option>
						<option value="submitted">Esperando revisión</option>
					</select>

					<select
						value={verification}
						onChange={(event) => setVerification(event.target.value)}
						className="h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					>
						<option value="all">Todos</option>
						<option value="verified">Email verificado</option>
						<option value="unverified">Email no verificado</option>
					</select>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[980px] text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase text-slate-500">
						<tr>
							<th className="px-6 py-4 font-semibold">Cliente</th>
							<th className="px-6 py-4 font-semibold">Trámite</th>
							<th className="px-6 py-4 font-semibold">Estado</th>
							<th className="px-6 py-4 font-semibold">Documentación</th>
							<th className="px-6 py-4 font-semibold">Email</th>
							<th className="px-6 py-4 font-semibold">Creado</th>
							<th className="px-6 py-4 text-right font-semibold">Acciones</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{clients.map((client) => (
							<tr key={client.id} className="hover:bg-slate-50">
								<td className="px-6 py-4">
									<p className="font-medium text-slate-900">
										{client.fullName}
									</p>
									<p className="text-xs text-slate-500">{client.email}</p>
								</td>

								<td className="px-6 py-4">{client.procedure}</td>

								<td className="px-6 py-4">
									<span
										className={
											client.status === "sent"
												? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
												: "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
										}
									>
										{client.status === "sent"
											? "Enviado a Abogada"
											: "No enviado"}
									</span>
								</td>

								<td className="px-6 py-4">
									<span
										className={
											client.emailVerification
												? "rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
												: "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
										}
									>
										{client.documentationCount > 0
											? `${client.documentationCount} documentos`
											: "Pendiente"}
									</span>
								</td>

								<td className="px-6 py-4">
									<span
										className={
											client.emailVerification
												? "rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
												: "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
										}
									>
										{client.emailVerification ? "Verificado" : "No verificado"}
									</span>
								</td>

								<td className="px-6 py-4 text-slate-500">
									{new Intl.DateTimeFormat("es-ES").format(
										new Date(client.createdAt),
									)}
								</td>

								<td className="px-6 py-4">
									<div className="flex justify-end gap-2">
										<Link
											href={`/admin/clients/${client.userId}`}
											className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
										>
											Ver
										</Link>

										{!client.emailVerification && (
											<button
												type="button"
												disabled={resendInvite.isPending}
												onClick={() => handleResendInvite(client.userId)}
												className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
											>
												<Mail className="h-3.5 w-3.5" />
												Reenviar
											</button>
										)}
									</div>
								</td>
							</tr>
						))}

						{clients.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="px-6 py-12 text-center text-slate-500"
								>
									No hay clientes que coincidan con los filtros.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
