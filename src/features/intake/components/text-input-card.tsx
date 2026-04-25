"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TextConditionalField } from "@/features/intake/types/wizard.types";
import { FileWarning } from "lucide-react";

export function TextInputCard({
	field,
	value,
	onValueChange,
	showRequiredWarning = false,
}: {
	field: TextConditionalField;
	value: string;
	onValueChange: (value: string) => void;
	showRequiredWarning?: boolean;
}) {
	const hasWarning = showRequiredWarning && value.trim().length === 0;

	const handleChange = (rawValue: string) => {
		let nextValue = rawValue;

		if (field.inputMode === "numeric") {
			nextValue = nextValue.replace(/\D/g, "");
		}

		if (field.maxLength) {
			nextValue = nextValue.slice(0, field.maxLength);
		}

		onValueChange(nextValue);
	};

	return (
		<Card
			className={`rounded-3xl border border-dashed shadow-none ${
				hasWarning ? "border-red-300" : "border-slate-200"
			}`}
		>
			<CardContent className="px-5 py-1">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-sm font-medium text-slate-900">{field.label}</p>

					{field.required ? (
						<Badge variant="secondary" className="rounded-full text-[10px]">
							Obligatorio
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="rounded-full border-slate-200 text-[10px] text-slate-500"
						>
							Opcional
						</Badge>
					)}
				</div>

				{field.hint ? (
					<p className="mt-1 text-xs leading-5 text-slate-500">{field.hint}</p>
				) : null}

				<div className="mt-4 rounded-2xl bg-slate-50 p-3">
					<Input
						value={value}
						inputMode={field.inputMode}
						maxLength={field.maxLength}
						onChange={(event) => handleChange(event.target.value)}
						className={`rounded-2xl bg-white ${
							hasWarning ? "border-red-300 focus-visible:ring-red-200" : ""
						}`}
					/>

					{field.maxLength ? (
						<p className="mt-2 text-xs text-slate-500">
							{value.length}/{field.maxLength} caracteres
						</p>
					) : null}

					{hasWarning ? (
						<div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
							<FileWarning className="mt-0.5 h-4 w-4 shrink-0" />
							<span>Campo obligatorio pendiente.</span>
						</div>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}
