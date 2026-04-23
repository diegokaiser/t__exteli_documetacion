import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileInputCard } from "@/features/intake/components/file-input-card";
import { laborDocuments } from "@/features/intake/config/wizard.config";
import { UploadedFileItem } from "@/features/intake/hooks/use-wizard-draft";
import {
	AsylumStatus,
	PersonalAge,
} from "@/features/intake/types/wizard.types";
import { AlertCircle } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function WizardStepLabor({
	age,
	asylum,
	setAsylum,
	adultNonAsylumSkips,
	setAdultNonAsylumSkips,
	files,
	onFilesChange,
	onClearFiles,
	showValidation,
}: {
	age: PersonalAge;
	asylum: AsylumStatus;
	setAsylum: (value: AsylumStatus) => void;
	adultNonAsylumSkips: Record<string, boolean>;
	setAdultNonAsylumSkips: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	files: Record<string, UploadedFileItem[]>;
	onFilesChange: (fieldId: string, files: FileList | null) => void;
	onClearFiles: (fieldId: string) => void;
	showValidation: boolean;
}) {
	if (!age) return null;

	const laborFields =
		age === "adult"
			? asylum === "yes"
				? laborDocuments.adult.asylumYes
				: laborDocuments.adult.asylumNo
			: asylum === "yes"
				? laborDocuments.minor.asylumYes
				: laborDocuments.minor.asylumNo;

	const adultNonAsylumIds = [
		"working-life-adult",
		"precontract-adult",
		"collective-registration-descendants",
		"collective-registration-ascendants",
	];

	const showVulnerabilityNotice =
		age === "adult" &&
		asylum === "no" &&
		adultNonAsylumIds.every((id) => adultNonAsylumSkips[id]);

	return (
		<div className="space-y-4">
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardContent className="space-y-4 px-5 py-1">
					<div>
						<p className="text-sm font-medium text-slate-900">
							¿Eres solicitante de protección internacional o asilo?
						</p>
						<p className="mt-1 text-xs leading-5 text-slate-500">
							Mostraremos los documentos de integración adecuados según tu
							situación actual.
						</p>
						<p className="mt-1 text-xs leading-5 text-slate-500">
							Toma en cuenta que debes haber solicitado protección internacional
							o asilo, <strong>antes del 31 de diciembre del 2025</strong>.
							Incluso si actualmente esta en{" "}
							<strong>trámite, denegado o en recurso</strong>.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<Button
							type="button"
							variant={asylum === "yes" ? "default" : "outline"}
							className="rounded-2xl"
							style={
								asylum === "yes"
									? { backgroundColor: colors.navy, color: "white" }
									: undefined
							}
							onClick={() => setAsylum("yes")}
						>
							Sí
						</Button>
						<Button
							type="button"
							variant={asylum === "no" ? "default" : "outline"}
							className="rounded-2xl"
							style={
								asylum === "no"
									? { backgroundColor: colors.navy, color: "white" }
									: undefined
							}
							onClick={() => setAsylum("no")}
						>
							No
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-3">
				{laborFields.map((field, index) => {
					const isAdultNonAsylumChain = age === "adult" && asylum === "no";
					const previousField = index > 0 ? laborFields[index - 1] : null;

					const disabled = isAdultNonAsylumChain
						? index === 0
							? false
							: !adultNonAsylumSkips[previousField!.id]
						: false;

					const selectedFiles = files[field.id] ?? [];

					return (
						<FileInputCard
							key={field.id}
							field={field}
							disabled={disabled}
							skipped={adultNonAsylumSkips[field.id]}
							showRequiredWarning={Boolean(
								showValidation &&
								field.required &&
								!adultNonAsylumSkips[field.id] &&
								selectedFiles.length === 0,
							)}
							onToggleSkip={
								isAdultNonAsylumChain
									? () =>
											setAdultNonAsylumSkips((prev) => {
												const next = { ...prev, [field.id]: !prev[field.id] };
												const currentIndex = adultNonAsylumIds.indexOf(
													field.id,
												);

												for (
													let i = currentIndex + 1;
													i < adultNonAsylumIds.length;
													i += 1
												) {
													next[adultNonAsylumIds[i]] = false;
												}

												return next;
											})
									: undefined
							}
							files={selectedFiles}
							onFilesChange={(selected) => onFilesChange(field.id, selected)}
							onClearFiles={() => onClearFiles(field.id)}
						/>
					);
				})}
			</div>

			{showVulnerabilityNotice ? (
				<>
					<Alert className="rounded-3xl border-0 bg-amber-50">
						<AlertCircle className="h-4 w-4 text-amber-600" />
						<AlertTitle className="text-amber-900">Caso alternativo</AlertTitle>
						<AlertDescription className="text-amber-800">
							Si ninguna de las condiciones anteriores se cumple, solicita este
							documento adicional.{" "}
							<a
								href="#"
								className="font-semibold underline underline-offset-4"
							>
								Descarga el documento
							</a>
						</AlertDescription>
					</Alert>

					<FileInputCard
						field={laborDocuments.adult.vulnerability}
						showRequiredWarning={Boolean(
							showValidation &&
							laborDocuments.adult.vulnerability.required &&
							(files[laborDocuments.adult.vulnerability.id] ?? []).length === 0,
						)}
						files={files[laborDocuments.adult.vulnerability.id] ?? []}
						onFilesChange={(selected) =>
							onFilesChange(laborDocuments.adult.vulnerability.id, selected)
						}
						onClearFiles={() =>
							onClearFiles(laborDocuments.adult.vulnerability.id)
						}
					/>
				</>
			) : null}
		</div>
	);
}
