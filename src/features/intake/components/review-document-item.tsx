import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ReviewItem } from "@/features/intake/utils/review-mappers";
import { CheckCircle2, CircleAlert, FileText } from "lucide-react";

export function ReviewDocumentItem({ item }: { item: ReviewItem }) {
	const isComplete = item.skipped || item.filesCount > 0;

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
									<CheckCircle2 className="h-4 w-4 text-emerald-600" />
									<span className="text-emerald-700">
										{item.skipped
											? "Marcado como no disponible"
											: `${item.filesCount} archivo(s) adjuntos`}
									</span>
								</>
							) : (
								<>
									<CircleAlert className="h-4 w-4 text-amber-600" />
									<span className="text-amber-700">
										No se adjuntó documento
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{!item.skipped && item.fileNames.length > 0 ? (
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
