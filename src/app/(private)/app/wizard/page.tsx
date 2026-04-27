"use client";

import { WizardView } from "@/features/intake/components/wizard-view";
import { useRouter } from "next/navigation";

export default function WizardPage() {
	const router = useRouter();

	return <WizardView onBackToDashboard={() => router.push("/app")} />;
}
