"use client";

import { SplashLoader } from "@/components/shared/splash-loader";
import { LoginForm } from "@/features/auth/components/login-form";
import { useDemoSession } from "@/features/auth/hooks/use-demo-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
	const router = useRouter();
	const { isCheckingSession, hasSession, login } = useDemoSession();

	useEffect(() => {
		if (!isCheckingSession && hasSession) {
			router.replace("/app");
		}
	}, [isCheckingSession, hasSession, router]);

	if (isCheckingSession) {
		return <SplashLoader />;
	}

	return (
		<LoginForm
			onLogin={() => {
				login();
				router.replace("/app");
			}}
		/>
	);
}
