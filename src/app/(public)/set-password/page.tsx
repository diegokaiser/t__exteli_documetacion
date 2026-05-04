// src/app/auth/set-password/page.tsx
import { SetPasswordForm } from "@/features/auth/components/set-password-form";

type SetPasswordPageProps = {
	searchParams: Promise<{
		userId?: string;
		secret?: string;
	}>;
};

export default async function SetPasswordPage({
	searchParams,
}: SetPasswordPageProps) {
	const params = await searchParams;

	return <SetPasswordForm userId={params.userId} secret={params.secret} />;
}
