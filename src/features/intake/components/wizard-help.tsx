import { Card, CardContent } from "@/components/ui/card";

export function WizardHelp() {
	return (
		<Card className="rounded-3xl border-0 shadow-lg">
			<CardContent className="space-y-4 px-5 py-1">
				<div>
					<p className="text-sm font-medium text-slate-900">
						¿Tu archivo PDF es muy pesado?
					</p>
					<p className="mt-1 text-xs leading-5 text-slate-500">
						Comprime tus archivos usando{" "}
						<a
							href="https://www.ilovepdf.com/compress_pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="border-b border-blue-600 inline-block font-medium pb-[1px] text-blue-600 sm:border-transparent sm:hover:border-blue-600"
							style={{ transition: "ease .35s" }}
						>
							iLovePDF
						</a>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
