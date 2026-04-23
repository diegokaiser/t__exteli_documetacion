import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function WizardNavigation({
	stepIndex,
	totalSteps,
	onPrev,
	onNext,
}: {
	stepIndex: number;
	totalSteps: number;
	onPrev: () => void;
	onNext: () => void;
}) {
	const isLastStep = stepIndex === totalSteps - 1;

	return (
		<div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-3">
			<Button
				variant="outline"
				className="h-11 rounded-[20px] cursor-pointer"
				onClick={onPrev}
				disabled={stepIndex === 0}
			>
				<ChevronLeft className="mr-1 h-4 w-4" />
				Anterior
			</Button>
			<Button
				className="h-11 rounded-[20px] cursor-pointer"
				style={{ backgroundColor: colors.navy, color: "white" }}
				onClick={onNext}
			>
				{isLastStep ? "Revisar documentos" : "Siguiente"}
				<ChevronRight className="ml-1 h-4 w-4" />
			</Button>
		</div>
	);
}
