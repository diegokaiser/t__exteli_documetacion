import { useEffect, useState } from "react";

const STORAGE_KEY = "client-session";

export function useDemoSession() {
	const [isCheckingSession, setIsCheckingSession] = useState(true);
	const [hasSession, setHasSession] = useState(false);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			const session = window.localStorage.getItem(STORAGE_KEY);
			setHasSession(Boolean(session));
			setIsCheckingSession(false);
		}, 900);

		return () => window.clearTimeout(timer);
	}, []);

	const login = () => {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ authenticated: true }),
		);
		setHasSession(true);
	};

	const logout = () => {
		window.localStorage.removeItem(STORAGE_KEY);
		setHasSession(false);
	};

	return {
		isCheckingSession,
		hasSession,
		login,
		logout,
	};
}
