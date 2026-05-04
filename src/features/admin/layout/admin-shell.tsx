import { AdminHeader } from "@/features/admin/layout/admin-header";
import { AdminSidebar } from "@/features/admin/layout/admin-sidebar";
import type { Models } from "node-appwrite";

type AdminShellProps = {
	children: React.ReactNode;
	user: Models.User<Models.Preferences>;
};

export function AdminShell({ children, user }: AdminShellProps) {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<AdminSidebar user={user} />

			<div className="min-h-screen lg:pl-72">
				<AdminHeader user={user} />

				<main className="px-6 py-8 lg:px-10">{children}</main>
			</div>
		</div>
	);
}
