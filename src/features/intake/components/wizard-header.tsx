import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function WizardHeader({
	stepIndex,
	titles,
}: {
	stepIndex: number;
	titles: string[];
}) {
	const progress = ((stepIndex + 1) / titles.length) * 100;

	return (
		<Card className="rounded-3xl border-0 shadow-lg">
			<CardContent className="space-y-4 px-5 py-1">
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium text-slate-900">
						Paso {stepIndex + 1} de {titles.length}
					</span>
					<span className="text-slate-500">{Math.round(progress)}%</span>
				</div>
				<Progress value={progress} className="h-2" />
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						{titles[stepIndex]}
					</h2>
					<p className="mt-1 text-sm leading-6 text-slate-600">
						{stepIndex === 0 &&
							"Define la situación personal para mostrar los documentos correctos."}
						{stepIndex === 1 &&
							"Sube los documentos laborales o de integración según el caso aplicable."}
						{stepIndex === 2 &&
							"Adjunta soporte adicional para reforzar el expediente."}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
