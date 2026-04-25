import { FileInputCard } from "@/features/intake/components/file-input-card";
import { complementaryDocuments } from "@/features/intake/config/wizard.config";
import { UploadedFileItem } from "@/features/intake/hooks/use-wizard-draft";
import { PersonalAge } from "@/features/intake/types/wizard.types";
import { isFileField } from "../utils/field-guards";

export function WizardStepComplementary({
	age,
	files,
	onFilesChange,
	onClearFiles,
	onRemoveFile,
	showValidation,
}: {
	age: PersonalAge;
	files: Record<string, UploadedFileItem[]>;
	onFilesChange: (fieldId: string, files: FileList | null) => void;
	onClearFiles: (fieldId: string) => void;
	onRemoveFile: (fieldId: string, index: number) => void;
	showValidation: boolean;
}) {
	if (!age) return null;

	const fields = complementaryDocuments[age];

	return (
		<div className="space-y-3">
			{fields.map((field) => {
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
	);
}
