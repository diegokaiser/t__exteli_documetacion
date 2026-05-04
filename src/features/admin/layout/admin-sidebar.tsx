import {
	FolderKanban,
	FolderPlus,
	LayoutDashboard,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";
import type { Models } from "node-appwrite";

type AdminSidebarProps = {
	user: Models.User<Models.Preferences>;
};

const navigation = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Clientes",
		items: [
			{
				title: "Ver clientes",
				href: "/admin/clients",
				icon: Users,
			},
			{
				title: "Crear cliente",
				href: "/admin/clients/new",
				icon: UserPlus,
			},
		],
	},
	{
		title: "Casos",
		items: [
			{
				title: "Ver casos",
				href: "/admin/cases",
				icon: FolderKanban,
			},
			{
				title: "Crear caso",
				href: "/admin/cases/new",
				icon: FolderPlus,
			},
		],
	},
];

export function AdminSidebar({ user }: AdminSidebarProps) {
	const displayName = user.name || user.email || "Administrador";

	return (
		<aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
			<div className="flex h-20 items-center border-b border-slate-100 px-6">
				<div>
					<p className="text-lg font-bold text-blue-600">Portal Admin</p>
					<p className="text-xs text-slate-500">Panel documental</p>
				</div>
			</div>

			<div className="px-4 py-6">
				<div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
					<p className="text-sm font-semibold text-slate-900">{displayName}</p>
					<p className="text-xs text-slate-500">Sesión activa</p>
				</div>

				<nav className="space-y-6">
					{navigation.map((section) => {
						if ("href" in section) {
							const Icon = section.icon;

							return (
								<Link
									key={section.title}
									href={section.href}
									className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
								>
									<Icon className="h-4 w-4" />
									{section.title}
								</Link>
							);
						}

						return (
							<div key={section.title}>
								<p className="mb-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-400">
									{section.title}
								</p>

								<div className="space-y-1">
									{section.items.map((item) => {
										const Icon = item.icon;

										return (
											<Link
												key={item.href}
												href={item.href}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
											>
												<Icon className="h-4 w-4" />
												{item.title}
											</Link>
										);
									})}
								</div>
							</div>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}
