"use client";

import { SubmissionSuccess } from "@/features/intake/components/submission-success";
import { useRouter } from "next/navigation";

export default function WizardSuccessPage() {
	const router = useRouter();

	return <SubmissionSuccess onGoDashboard={() => router.push("/app")} />;
}
