"use client";

import { AppShell } from "@/components/shared/app-shell";
import { MobileNav } from "@/components/shared/mobile-nav";
import { WizardHeader } from "@/features/intake/components/wizard-header";
import { WizardHelp } from "@/features/intake/components/wizard-help";
import { WizardNavigation } from "@/features/intake/components/wizard-navigation";
import { WizardStepComplementary } from "@/features/intake/components/wizard-step-complementary";
import { WizardStepLabor } from "@/features/intake/components/wizard-step-labor";
import { WizardStepPersonal } from "@/features/intake/components/wizard-step-personal";
import {
	complementaryDocuments,
	laborDocuments,
	personalDocuments,
} from "@/features/intake/config/wizard.config";
import { useWizardDraft } from "@/features/intake/hooks/use-wizard-draft";
import { useEffect, useMemo, useRef, useState } from "react";

export function WizardView({
	onBackToDashboard,
	onReview,
}: {
	onBackToDashboard: () => void;
	onReview: () => void;
}) {
	const [stepIndex, setStepIndex] = useState(0);
	const [attemptedNextByStep, setAttemptedNextByStep] = useState<
		Record<number, boolean>
	>({});
	const { draft, setAge, setAsylum, setSkip, setFiles, clearFile } =
		useWizardDraft();

	const [adultNonAsylumSkips, setAdultNonAsylumSkips] = useState(draft.skipped);
	const titles = [
		"Datos personales",
		"Datos laborales o de integración",
		"Datos complementarios",
	];

	const headerRef = useRef<HTMLDivElement | null>(null);
	const isFirstRender = useRef(true);

	useEffect(() => {
		setAdultNonAsylumSkips(draft.skipped);
	}, [draft.skipped]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		headerRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest",
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
			const laborFields =
				draft.age === "adult"
					? draft.asylum === "yes"
						? laborDocuments.adult.asylumYes
						: laborDocuments.adult.asylumNo
					: draft.asylum === "yes"
						? laborDocuments.minor.asylumYes
						: laborDocuments.minor.asylumNo;

			const adultNonAsylumIds = [
				"working-life-adult",
				"precontract-adult",
				"collective-registration-descendants",
				"collective-registration-ascendants",
			];

			const visibleFields = laborFields.filter((field, index) => {
				const isAdultNonAsylumChain =
					draft.age === "adult" && draft.asylum === "no";
				if (!isAdultNonAsylumChain) return true;
				if (index === 0) return true;

				const previousField = laborFields[index - 1];
				return Boolean(draft.skipped[previousField.id]);
			});

			const visibleRequiredMissing = visibleFields.some((field) => {
				const isSkipped = Boolean(draft.skipped[field.id]);
				const hasFiles = (draft.files[field.id] ?? []).length > 0;
				return field.required && !isSkipped && !hasFiles;
			});

			const showVulnerability =
				draft.age === "adult" &&
				draft.asylum === "no" &&
				adultNonAsylumIds.every((id) => draft.skipped[id]);

			const vulnerabilityMissing =
				showVulnerability &&
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
			setStepIndex((prev) => prev + 1);
			return;
		}

		onReview();
	};

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
						showValidation={currentStepAttempted}
					/>
				) : null}

				{stepIndex === 1 ? (
					<WizardStepLabor
						age={draft.age}
						asylum={draft.asylum}
						setAsylum={setAsylum}
						adultNonAsylumSkips={adultNonAsylumSkips}
						setAdultNonAsylumSkips={(updater) => {
							setAdultNonAsylumSkips((prev) => {
								const next =
									typeof updater === "function" ? updater(prev) : updater;
								Object.entries(next).forEach(([fieldId, value]) =>
									setSkip(fieldId, Boolean(value)),
								);
								return next;
							});
						}}
						files={draft.files}
						onFilesChange={setFiles}
						onClearFiles={clearFile}
						showValidation={currentStepAttempted}
					/>
				) : null}

				{stepIndex === 2 ? (
					<WizardStepComplementary
						age={draft.age}
						files={draft.files}
						onFilesChange={setFiles}
						onClearFiles={clearFile}
						showValidation={currentStepAttempted}
					/>
				) : null}

				<WizardNavigation
					stepIndex={stepIndex}
					totalSteps={titles.length}
					onPrev={() => setStepIndex((prev) => Math.max(0, prev - 1))}
					onNext={handleNext}
				/>

				<MobileNav
					active="wizard"
					onDashboard={onBackToDashboard}
					onWizard={() => undefined}
				/>
			</div>
		</AppShell>
	);
}
