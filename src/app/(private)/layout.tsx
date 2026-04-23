"use client";

import { SplashLoader } from "@/components/shared/splash-loader";
import { useDemoSession } from "@/features/auth/hooks/use-demo-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { isCheckingSession, hasSession } = useDemoSession();

	useEffect(() => {
		if (!isCheckingSession && !hasSession) {
			router.replace("/login");
		}
	}, [isCheckingSession, hasSession, router]);

	if (isCheckingSession) {
		return <SplashLoader />;
	}

	if (!hasSession) {
		return null;
	}

	return <>{children}</>;
}
