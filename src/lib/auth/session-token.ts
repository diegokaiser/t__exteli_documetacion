// src/lib/auth/session-token.ts

import crypto from "crypto";

type SessionPayload = {
	userId: string;
	role: "admin" | "client";
};

function getSecret() {
	const secret = process.env.AUTH_SESSION_SECRET;

	if (!secret) {
		throw new Error("AUTH_SESSION_SECRET is not configured");
	}

	return secret;
}

export function signSession(payload: SessionPayload) {
	const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
		"base64url",
	);

	const signature = crypto
		.createHmac("sha256", getSecret())
		.update(encodedPayload)
		.digest("base64url");

	return `${encodedPayload}.${signature}`;
}

export function verifySession(token?: string): SessionPayload | null {
	if (!token) return null;

	const [encodedPayload, signature] = token.split(".");

	if (!encodedPayload || !signature) return null;

	const expectedSignature = crypto
		.createHmac("sha256", getSecret())
		.update(encodedPayload)
		.digest("base64url");

	if (
		!crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		)
	) {
		return null;
	}

	return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
}
