import { getCurrentSession } from "@/lib/auth/get-current-session";
import { redirect } from "next/navigation";

export default async function PrivateLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getCurrentSession();

	if (!session) {
		redirect("/login");
	}

	if (session.role !== "client") {
		redirect("/admin");
	}

	return <>{children}</>;
}
