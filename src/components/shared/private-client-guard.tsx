"use client";

import { SplashLoader } from "@/components/shared/splash-loader";
import { useEffect, useState } from "react";

export function PrivateClientGuard({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <SplashLoader />;
	}

	return <>{children}</>;
}
