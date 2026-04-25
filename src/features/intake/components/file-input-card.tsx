"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FileConditionalField } from "@/features/intake/types/wizard.types";
import { AlertCircle, FileText, FileWarning, X } from "lucide-react";
import { useMemo, useState } from "react";

const colors = {
	navy: "#0D3B66",
};

type SelectedFile = {
	name: string;
	size?: number;
	type?: string;
};

function formatAcceptedTypes(accept?: string[]) {
	if (!accept || accept.length === 0) return undefined;

	return accept
		.map((type) => {
			if (type === "application/pdf") return ".pdf";
			return type;
		})
		.join(",");
}

function getReadableAcceptedTypes(accept?: string[]) {
	if (!accept || accept.length === 0) return "Formato no especificado";

	const labels = accept.map((type) => {
		if (type === "application/pdf") return "PDF";
		return type;
	});

	return `Solo ${labels.join(", ")}`;
}

function getReadableRules(field: FileConditionalField) {
	const parts: string[] = [];

	if (field.accept?.length) {
		parts.push(getReadableAcceptedTypes(field.accept));
	}

	if (field.maxSizeMB) {
		parts.push(`Máx. ${field.maxSizeMB}MB`);
	}

	return parts.join(" · ");
}

function validateFiles(field: FileConditionalField, fileList: FileList | null) {
	if (!fileList || fileList.length === 0) {
		return { valid: true, error: "" };
	}

	const files = Array.from(fileList);

	for (const file of files) {
		if (field.accept && field.accept.length > 0) {
			const isAccepted =
				field.accept.includes(file.type) ||
				(file.name?.toLowerCase().endsWith(".pdf") &&
					field.accept.includes("application/pdf"));

			if (!isAccepted) {
				return {
					valid: false,
					error: "Formato no válido. Solo se acepta PDF.",
				};
			}
		}

		if (field.maxSizeMB) {
			const maxSizeBytes = field.maxSizeMB * 1024 * 1024;

			if (file.size > maxSizeBytes) {
				return {
					valid: false,
					error: `El archivo supera el tamaño máximo permitido de ${field.maxSizeMB}MB.`,
				};
			}
		}
	}

	return { valid: true, error: "" };
}

export function FileInputCard({
	field,
	disabled = false,
	skipped,
	onToggleSkip,
	files = [],
	onFilesChange,
	onClearFiles,
	onRemoveFile,
	showRequiredWarning = false,
}: {
	field: FileConditionalField;
	disabled?: boolean;
	skipped?: boolean;
	onToggleSkip?: () => void;
	files?: SelectedFile[];
	onFilesChange?: (files: FileList | null) => void;
	onClearFiles?: () => void;
	onRemoveFile?: (index: number) => void;
	showRequiredWarning?: boolean;
}) {
	const [error, setError] = useState("");

	const acceptValue = useMemo(
		() => formatAcceptedTypes(field.accept),
		[field.accept],
	);
	const rulesText = useMemo(() => getReadableRules(field), [field]);

	const handleFileChange = (selectedFiles: FileList | null) => {
		const validation = validateFiles(field, selectedFiles);

		if (!validation.valid) {
			setError(validation.error);
			onFilesChange?.(null);
			return;
		}

		setError("");
		onFilesChange?.(selectedFiles);
	};

	const handleClearFiles = () => {
		setError("");
		onClearFiles?.();
	};

	const hasVisualWarning =
		showRequiredWarning && !skipped && files.length === 0;

	return (
		<Card
			className={`rounded-3xl border border-dashed shadow-none transition-opacity ${
				disabled
					? "border-slate-200 opacity-50"
					: error || hasVisualWarning
						? "border-red-300"
						: "border-slate-200 opacity-100"
			}`}
		>
			<CardContent className="px-5 py-1">
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className="flex flex-wrap items-center gap-2">
							<p
								className={`text-sm font-medium text-slate-900 ${
									skipped ? "line-through" : ""
								}`}
							>
								{field.label}
							</p>

							{!skipped ? (
								field.required ? (
									<Badge
										variant="mandatory"
										className="rounded-full text-[10px]"
									>
										Obligatorio
									</Badge>
								) : (
									<Badge
										variant="optional"
										className="rounded-full border-slate-200 text-[10px] text-slate-500"
									>
										Opcional
									</Badge>
								)
							) : null}
						</div>

						{field.hint ? (
							<p
								className={`mt-1 text-xs leading-5 text-slate-500 ${
									skipped ? "line-through" : ""
								}`}
							>
								{field.hint}
							</p>
						) : null}

						{rulesText ? (
							<div className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
								{rulesText}
							</div>
						) : null}
					</div>
				</div>

				{field.optionalToggle ? (
					<div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
						<p className="text-sm text-slate-700">
							{skipped
								? "¿Tienes este documento?"
								: "¿No dispones de este documento?"}
						</p>

						<Button
							type="button"
							variant={skipped ? "default" : "outline"}
							className="shrink-0 rounded-2xl"
							style={
								skipped
									? { backgroundColor: colors.navy, color: "white" }
									: undefined
							}
							onClick={onToggleSkip}
							disabled={disabled}
						>
							{skipped ? "Sí tengo" : field.optionalToggle}
						</Button>
					</div>
				) : null}

				{!skipped ? (
					<div className="mt-2 rounded-2xl bg-slate-50 p-3">
						<Label
							htmlFor={field.id}
							className="mb-3 block text-sm font-medium text-slate-700"
						>
							Seleccionar archivo{field.multiple ? "s" : ""}
						</Label>

						<Input
							id={field.id}
							type="file"
							multiple={field.multiple}
							className={`cursor-pointer rounded-2xl bg-white ${
								error || hasVisualWarning
									? "border-red-300 focus-visible:ring-red-200"
									: ""
							}`}
							disabled={disabled}
							accept={acceptValue}
							onChange={(event) => handleFileChange(event.target.files)}
						/>

						<p className="mt-2 text-xs text-slate-500">
							{field.multiple
								? "Puedes adjuntar varios archivos en una sola selección."
								: "Adjunta un único archivo para este requisito."}
						</p>

						{hasVisualWarning ? (
							<div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
								<FileWarning className="mt-0.5 h-4 w-4 shrink-0" />
								<span>Documento obligatorio pendiente.</span>
							</div>
						) : null}

						{error ? (
							<div className="mt-3 flex items-start gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-700">
								<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
								<span>{error}</span>
							</div>
						) : null}

						{files.length > 0 ? (
							<div className="mt-3 space-y-2">
								{files.map((file, index) => (
									<div
										key={`${field.id}-${file.name}-${index}`}
										className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-xs text-slate-700"
									>
										<div className="flex min-w-0 items-center gap-2">
											<FileText className="h-4 w-4 shrink-0 text-slate-400" />
											<span className="truncate pr-3">{file.name}</span>
										</div>

										{onRemoveFile ? (
											<button
												type="button"
												onClick={() => onRemoveFile(index)}
												className="shrink-0 text-slate-400 hover:text-slate-700"
												aria-label={`Eliminar archivo ${file.name}`}
											>
												<X className="h-4 w-4" />
											</button>
										) : onClearFiles ? (
											<button
												type="button"
												onClick={handleClearFiles}
												className="shrink-0 text-slate-400 hover:text-slate-700"
												aria-label="Eliminar archivo"
											>
												<X className="h-4 w-4" />
											</button>
										) : null}
									</div>
								))}
							</div>
						) : null}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
