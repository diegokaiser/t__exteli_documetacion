"use client";

import { FileText, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAdminClientDetail } from "./use-admin-client-detail";

type ClientDetailProps = {
	clientId: string;
};

export function ClientDetail({ clientId }: ClientDetailProps) {
	const { data, isLoading, isError, error } = useAdminClientDetail(clientId);

	useEffect(() => {
		if (!data) return;

		console.log("[CLIENT_DETAIL] Profile:", data.profile);
		console.log("[CLIENT_DETAIL] Auth user:", data.authUser);
		console.log("[CLIENT_DETAIL] Case:", data.case);
		console.log("[CLIENT_DETAIL] Document assets:", data.documentAssets);
		console.log(
			"[CLIENT_DETAIL] Document submissions:",
			data.documentSubmissions,
		);
	}, [data]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
				<Loader2 className="h-8 w-8 animate-spin text-slate-600" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
				{error.message}
			</div>
		);
	}

	return (
		<section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="border-b border-slate-100 p-6">
				<div className="">
					<div>
						<div className="flex items-center gap-x-2">
							<span className="font-medium">{data.profile.fullName}</span>
							<span
								className={
									data.case?.ageCategory === "minor"
										? "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
										: "rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
								}
							>
								{data.case.ageCategory === "minor" ? "Menor de edad" : "Adulto"}
							</span>
							<span
								className={
									data.case?.asylumStatus === "no"
										? "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
										: "rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
								}
							>
								{data.case.asylumStatus === "no"
									? "No es solicitante de asilo"
									: "Solicitante de asilo"}
							</span>
						</div>
						<div className="capitalize text-[16px]">
							{data.profile.documentType}: {data.profile.documentNumber}
						</div>
					</div>
					<div className="flex flex-col gap-y-2 mt-4 text-[16px]">
						{data.documentAssets.map((document: any) => {
							const fileUrl = `/api/admin/files/${document.appwriteFileId}/view`;
							const downloadUrl = `/api/admin/files/${document.appwriteFileId}/download`;

							return (
								<div
									key={document.$id}
									className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
								>
									<div className="flex items-center gap-x-2">
										<FileText className="h-4 w-4 text-slate-400" />

										<div className="flex flex-col">
											<span className="text-sm font-medium text-slate-900">
												{document.originalFilename}
											</span>

											<span className="text-xs text-slate-500">
												{(document.sizeBytes / 1024).toFixed(1)} KB
											</span>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<a
											href={fileUrl}
											target="_blank"
											rel="noreferrer"
											className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
										>
											Ver
										</a>

										<a
											href={downloadUrl}
											className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
										>
											Descargar
										</a>
									</div>
								</div>
							);
						})}
					</div>
					<div className="mt-4">
						<button
							type="button"
							onClick={async () => {
								const response = await fetch(
									`/api/admin/cases/${data.case.$id}/prepare-and-send`,
									{ method: "POST" },
								);

								if (!response.ok) return;

								const blob = await response.blob();
								const url = window.URL.createObjectURL(blob);

								const link = document.createElement("a");
								link.href = url;
								link.download = `case-${data.case.$id}-documents.zip`;
								link.click();
								link.remove();
								window.URL.revokeObjectURL(url);
							}}
							className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
						>
							Preparar y enviar
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
