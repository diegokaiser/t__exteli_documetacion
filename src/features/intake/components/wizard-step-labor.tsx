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
import {
	getFilesToClearForAdultNonAsylumToggle,
	getNextSkippedStateForAdultNonAsylum,
	getVisibleLaborFields,
	shouldShowVulnerability,
} from "@/features/intake/utils/labor-rules";
import { AlertCircle } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

const DISABILITY_REGISTRATION_ID =
	"collective-registration-descendants-disability";
const DISABILITY_CERTIFICATE_ID =
	"collective-certificate-descendants-disability";

export function WizardStepLabor({
	age,
	asylum,
	setAsylum,
	skipped,
	setSkipped,
	clearFiles,
	files,
	onFilesChange,
	onClearFiles,
	onRemoveFile,
	showValidation,
}: {
	age: PersonalAge;
	asylum: AsylumStatus;
	setAsylum: (value: AsylumStatus) => void;
	skipped: Record<string, boolean>;
	setSkipped: (nextSkipped: Record<string, boolean>) => void;
	clearFiles: (fieldIds: string[]) => void;
	files: Record<string, UploadedFileItem[]>;
	onFilesChange: (fieldId: string, files: FileList | null) => void;
	onClearFiles: (fieldId: string) => void;
	onRemoveFile: (fieldId: string, index: number) => void;
	showValidation: boolean;
}) {
	if (!age) return null;

	const laborFields = getVisibleLaborFields(age, asylum, skipped);
	const showVulnerabilityNotice = shouldShowVulnerability(age, asylum, skipped);

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
							o asilo, antes del 31 de diciembre del 2025. Incluso si
							actualmente esta en trámite, denegado o en recurso.
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
				{laborFields.map((field) => {
					const selectedFiles = files[field.id] ?? [];
					const isAdultNonAsylumChain =
						age === "adult" && asylum === "no" && Boolean(field.optionalToggle);

					const isDisabilityCertificateField =
						field.id === DISABILITY_CERTIFICATE_ID;

					const isDisabilityCertificateDisabled =
						isDisabilityCertificateField &&
						Boolean(skipped[DISABILITY_REGISTRATION_ID]);

					return (
						<FileInputCard
							key={field.id}
							field={field}
							disabled={isDisabilityCertificateDisabled}
							skipped={skipped[field.id]}
							showRequiredWarning={Boolean(
								showValidation &&
								field.required &&
								!skipped[field.id] &&
								selectedFiles.length === 0,
							)}
							onToggleSkip={
								isAdultNonAsylumChain
									? () => {
											const nextSkipped = getNextSkippedStateForAdultNonAsylum(
												field.id,
												skipped,
											);
											const fieldIdsToClear =
												getFilesToClearForAdultNonAsylumToggle(
													field.id,
													skipped,
												);

											setSkipped(nextSkipped);
											clearFiles(fieldIdsToClear);
										}
									: undefined
							}
							files={selectedFiles}
							onFilesChange={(selected) => onFilesChange(field.id, selected)}
							onClearFiles={() => onClearFiles(field.id)}
							onRemoveFile={(index) => onRemoveFile(field.id, index)}
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
							documento adicional.
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
						onRemoveFile={(index) =>
							onRemoveFile(laborDocuments.adult.vulnerability.id, index)
						}
					/>
				</>
			) : null}
		</div>
	);
}
