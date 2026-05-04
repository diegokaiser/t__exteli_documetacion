import { Menu } from "lucide-react";
import type { Models } from "node-appwrite";

type AdminHeaderProps = {
	user: Models.User<Models.Preferences>;
};

export function AdminHeader({ user }: AdminHeaderProps) {
	const displayName = user.name || user.email || "Admin";
	const initial = displayName.charAt(0).toUpperCase();

	return (
		<header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 backdrop-blur lg:px-10">
			<button className="rounded-lg p-2 text-slate-500 hover:bg-white lg:hidden">
				<Menu className="h-5 w-5" />
			</button>

			<div />

			<div className="flex items-center gap-3">
				<div className="hidden text-right sm:block">
					<p className="text-sm font-semibold text-slate-900">{displayName}</p>
					<p className="text-xs text-slate-500">Administrador</p>
				</div>

				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
					{initial}
				</div>
			</div>
		</header>
	);
}
