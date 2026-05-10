"use client";

import { AppShell } from "@/components/shared/app-shell";
import { MobileNav } from "@/components/shared/mobile-nav";
import { WizardHeader } from "@/features/intake/components/wizard-header";
import { WizardHelp } from "@/features/intake/components/wizard-help";
import { WizardNavigation } from "@/features/intake/components/wizard-navigation";
import { WizardReviewView } from "@/features/intake/components/wizard-review-view";
import { WizardStepComplementary } from "@/features/intake/components/wizard-step-complementary";
import { WizardStepLabor } from "@/features/intake/components/wizard-step-labor";
import { WizardStepPersonal } from "@/features/intake/components/wizard-step-personal";
import {
	complementaryDocuments,
	laborDocuments,
	personalDocuments,
} from "@/features/intake/config/wizard.config";
import { useWizardDraft } from "@/features/intake/hooks/use-wizard-draft";
import {
	getVisibleLaborFields,
	isEffectivelyRequiredLaborField,
	shouldShowVulnerability,
} from "@/features/intake/utils/labor-rules";
import { useEffect, useMemo, useRef, useState } from "react";

import { SplashLoader } from "@/components/shared/splash-loader";
import { useRouter } from "next/navigation";
import { useSubmitIntake } from "../hooks/use-submit-intake";

export function WizardView({
	onBackToDashboard,
}: {
	onBackToDashboard: () => void;
}) {
	const [stepIndex, setStepIndex] = useState(0);
	const [attemptedNextByStep, setAttemptedNextByStep] = useState<
		Record<number, boolean>
	>({});

	const {
		draft,
		setAge,
		setAsylum,
		setSkipped,
		setFiles,
		setValue,
		clearFile,
		clearFiles,
		removeFile,
		markSubmitted,
	} = useWizardDraft();

	const headerRef = useRef<HTMLDivElement | null>(null);
	const isFirstStepRender = useRef(true);

	const [isChangingStep, setIsChangingStep] = useState(false);

	const router = useRouter();
	const submitIntake = useSubmitIntake();

	const titles = [
		"Datos personales",
		"Datos laborales o de integración",
		"Datos complementarios",
		"Revisión",
	];

	const goToStepWithLoader = (nextStep: number) => {
		setIsChangingStep(true);

		window.setTimeout(() => {
			setStepIndex(nextStep);
			setIsChangingStep(false);
		}, 350);
	};

	useEffect(() => {
		if (isFirstStepRender.current) {
			isFirstStepRender.current = false;
			return;
		}

		headerRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, [stepIndex]);

	const currentStepAttempted = Boolean(attemptedNextByStep[stepIndex]);

	const stepHasMissingRequired = useMemo(() => {
		if (!draft.age) return false;

		if (stepIndex === 0) {
			const fields = personalDocuments[draft.age];
			return fields.some(
				(field) => field.required && (draft.files[field.id] ?? []).length === 0,
			);
		}

		if (stepIndex === 1) {
			const visibleLaborFields = getVisibleLaborFields(
				draft.age,
				draft.asylum,
				draft.skipped,
			);

			const visibleRequiredMissing = visibleLaborFields.some((field) => {
				const isSkipped = Boolean(draft.skipped[field.id]);
				const isRequired = isEffectivelyRequiredLaborField(
					field.id,
					draft.age,
					draft.asylum,
					draft.skipped,
				);

				if (!isRequired || isSkipped) return false;

				if (field.type === "text") {
					const value = draft.values[field.id] ?? "";
					return value.trim().length === 0 || !field.pattern?.test(value);
				}

				const hasFiles = (draft.files[field.id] ?? []).length > 0;
				return !hasFiles;
			});

			const vulnerabilityMissing =
				shouldShowVulnerability(draft.age, draft.asylum, draft.skipped) &&
				Boolean(laborDocuments.adult.vulnerability.required) &&
				(draft.files[laborDocuments.adult.vulnerability.id] ?? []).length === 0;

			return visibleRequiredMissing || vulnerabilityMissing;
		}

		if (stepIndex === 2) {
			const fields = complementaryDocuments[draft.age];
			return fields.some(
				(field) => field.required && (draft.files[field.id] ?? []).length === 0,
			);
		}

		return false;
	}, [draft.age, draft.asylum, draft.files, draft.skipped, stepIndex]);

	const handleNext = () => {
		if (stepHasMissingRequired) {
			setAttemptedNextByStep((prev) => ({
				...prev,
				[stepIndex]: true,
			}));
			return;
		}

		if (stepIndex < titles.length - 1) {
			goToStepWithLoader(stepIndex + 1);
		}
	};

	if (isChangingStep) {
		return <SplashLoader message="Procesando documentos..." />;
	}

	if (submitIntake.isPending) {
		return <SplashLoader message="Enviando documentación..." />;
	}

	return (
		<AppShell
			title="Carga de documentos"
			subtitle="Completa cada paso adjuntando los archivos solicitados. La lógica condicional se adapta según edad y situación de asilo."
			showBack
			onBack={onBackToDashboard}
		>
			<div className="space-y-4 pb-20">
				<div ref={headerRef}>
					<WizardHeader stepIndex={stepIndex} titles={titles} />
				</div>

				<WizardHelp />

				{stepIndex === 0 ? (
					<WizardStepPersonal
						age={draft.age}
						setAge={setAge}
						files={draft.files}
						onFilesChange={setFiles}
						onClearFiles={clearFile}
						onRemoveFile={removeFile}
						showValidation={currentStepAttempted}
					/>
				) : null}

				{stepIndex === 1 ? (
					<WizardStepLabor
						age={draft.age}
						asylum={draft.asylum}
						setAsylum={setAsylum}
						skipped={draft.skipped}
						setSkipped={setSkipped}
						clearFiles={clearFiles}
						files={draft.files}
						values={draft.values}
						onValueChange={setValue}
						onFilesChange={setFiles}
						onClearFiles={clearFile}
						onRemoveFile={removeFile}
						showValidation={currentStepAttempted}
					/>
				) : null}

				{stepIndex === 2 ? (
					<WizardStepComplementary
						age={draft.age}
						files={draft.files}
						onFilesChange={setFiles}
						onClearFiles={clearFile}
						onRemoveFile={removeFile}
						showValidation={currentStepAttempted}
					/>
				) : null}

				{stepIndex === 3 ? (
					<WizardReviewView
						draft={draft}
						onBack={() => goToStepWithLoader(2)}
						isConfirming={submitIntake.isPending}
						onConfirm={async () => {
							await submitIntake.mutateAsync(draft);
							markSubmitted();
							router.replace("/app/wizard/success");
						}}
					/>
				) : null}

				{stepIndex < 3 ? (
					<WizardNavigation
						stepIndex={stepIndex}
						totalSteps={titles.length}
						onPrev={() => goToStepWithLoader(Math.max(0, stepIndex - 1))}
						onNext={handleNext}
					/>
				) : null}

				<MobileNav
					active="wizard"
					onDashboard={onBackToDashboard}
					onWizard={() => undefined}
				/>
			</div>
		</AppShell>
	);
}
