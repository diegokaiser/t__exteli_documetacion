import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ReviewItem } from "@/features/intake/utils/review-mappers";
import { CheckCircle2, CircleAlert, CircleX, FileText } from "lucide-react";

export function ReviewDocumentItem({ item }: { item: ReviewItem }) {
	const isTextItem = item.type === "text";
	const hasTextValue = Boolean(item.value?.trim());
	const isComplete = item.skipped || item.filesCount > 0 || hasTextValue;

	return (
		<Card className="rounded-3xl border border-slate-200 shadow-none">
			<CardContent className="space-y-3 px-5 py-1">
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className="flex flex-wrap items-center gap-2">
							<p className="text-sm font-medium text-slate-900">{item.label}</p>

							{item.required ? (
								<Badge variant="mandatory" className="rounded-full text-[10px]">
									Obligatorio
								</Badge>
							) : (
								<Badge variant="optional" className="rounded-full text-[10px]">
									Opcional
								</Badge>
							)}
						</div>

						<div className="mt-2 flex items-center gap-2 text-xs">
							{isComplete ? (
								<>
									{item.skipped ? (
										<>
											<CircleAlert className="h-4 w-4 text-amber-600" />
											<span className="text-amber-600">
												Marcado como no disponible
											</span>
										</>
									) : isTextItem ? (
										<>
											<CheckCircle2 className="h-4 w-4 text-emerald-600" />
											<span className="text-emerald-700">Valor ingresado</span>
										</>
									) : (
										<>
											<CheckCircle2 className="h-4 w-4 text-emerald-600" />
											<span className="text-emerald-700">
												{item.filesCount} archivo(s) adjuntos
											</span>
										</>
									)}
								</>
							) : (
								<>
									<CircleX className="h-4 w-4 text-amber-600" />
									<span className="text-amber-700">
										{isTextItem
											? "No se ingresó ningún valor"
											: "No se adjuntó documento"}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{isTextItem && item.value ? (
					<div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
						{item.value}
					</div>
				) : null}

				{!item.skipped && !isTextItem && item.fileNames.length > 0 ? (
					<div className="space-y-2 rounded-2xl bg-slate-50 p-3">
						{item.fileNames.map((fileName, index) => (
							<div
								key={`${item.id}-${fileName}-${index}`}
								className="flex items-center gap-2 text-xs text-slate-700"
							>
								<FileText className="h-4 w-4 text-slate-400" />
								<span className="truncate">{fileName}</span>
							</div>
						))}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
