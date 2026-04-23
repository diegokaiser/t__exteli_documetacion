"use client";

import { WizardReviewView } from "@/features/intake/components/wizard-review-view";
import { useRouter } from "next/navigation";

export default function WizardReviewPage() {
	const router = useRouter();

	return (
		<WizardReviewView
			onBack={() => router.push("/app/wizard")}
			onConfirm={() => router.push("/app/wizard/success")}
		/>
	);
}
