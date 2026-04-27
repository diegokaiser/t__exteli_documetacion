import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileInputCard } from "@/features/intake/components/file-input-card";
import { personalDocuments } from "@/features/intake/config/wizard.config";
import { PersonalAge } from "@/features/intake/types/wizard.types";
import { isFileField } from "../utils/field-guards";

const colors = {
	navy: "#0D3B66",
};

export function WizardStepPersonal({
	age,
	setAge,
	files,
	onFilesChange,
	onClearFiles,
	onRemoveFile,
	showValidation,
}: {
	age: PersonalAge;
	setAge: (age: PersonalAge) => void;
	files: Record<string, File[]>;
	onFilesChange: (fieldId: string, files: FileList | null) => void;
	onClearFiles: (fieldId: string) => void;
	onRemoveFile: (fieldId: string, index: number) => void;
	showValidation: boolean;
}) {
	const personalFields = age ? personalDocuments[age] : [];

	return (
		<div className="space-y-4">
			<Card className="rounded-3xl border-0 shadow-lg">
				<CardContent className="space-y-4 px-5 py-1">
					<div>
						<p className="text-sm font-medium text-slate-900">
							¿Eres mayor de edad?
						</p>
						<p className="mt-1 text-xs leading-5 text-slate-500">
							Esta respuesta determina los documentos del paso de datos
							personales y los pasos posteriores.
						</p>
					</div>
					<div className="flex flex-col gap-y-3 sm:grid sm:grid-cols-2 sm:gap-3">
						<Button
							type="button"
							variant={age === "adult" ? "default" : "outline"}
							className="rounded-2xl"
							style={
								age === "adult"
									? { backgroundColor: colors.navy, color: "white" }
									: undefined
							}
							onClick={() => setAge("adult")}
						>
							Sí, mayor de edad
						</Button>
						<Button
							type="button"
							variant={age === "minor" ? "default" : "outline"}
							className="rounded-2xl"
							style={
								age === "minor"
									? { backgroundColor: colors.navy, color: "white" }
									: undefined
							}
							onClick={() => setAge("minor")}
						>
							No, menor de edad
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-3">
				{personalFields.map((field) => {
					if (!isFileField(field)) return null;

					const selectedFiles = files[field.id] ?? [];
					const showRequiredWarning = Boolean(
						showValidation && field.required && selectedFiles.length === 0,
					);

					return (
						<FileInputCard
							key={field.id}
							field={field}
							files={selectedFiles}
							showRequiredWarning={showRequiredWarning}
							onFilesChange={(selected) => onFilesChange(field.id, selected)}
							onClearFiles={() => onClearFiles(field.id)}
							onRemoveFile={(index) => onRemoveFile(field.id, index)}
						/>
					);
				})}
			</div>
		</div>
	);
}
