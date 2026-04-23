import { Card, CardContent } from "@/components/ui/card";
import { Home, LogOut, Upload, User } from "lucide-react";

const colors = {
	navy: "#0D3B66",
};

export function MobileNav({
	active,
	onDashboard,
	onWizard,
	onLogout,
}: {
	active: "dashboard" | "wizard";
	onDashboard?: () => void;
	onWizard?: () => void;
	onLogout?: () => void;
}) {
	const items = [
		{ id: "dashboard", label: "Inicio", icon: Home, action: onDashboard },
		{ id: "wizard", label: "Documentos", icon: Upload, action: onWizard },
		{ id: "profile", label: "Perfil", icon: User, action: undefined },
		{ id: "logout", label: "Salir", icon: LogOut, action: onLogout },
	] as const;

	return (
		<div className="fixed bottom-4 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4 sm:px-0">
			<Card className="rounded-3xl border-0 bg-white/95 shadow-xl backdrop-blur py-2">
				<CardContent className="grid grid-cols-4 py-0 px-2">
					{items.map((item) => {
						const Icon = item.icon;
						const isActive = item.id === active;
						return (
							<button
								key={item.id}
								className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-[11px] font-medium transition-colors"
								style={{
									backgroundColor: isActive
										? "rgba(13,59,102,0.1)"
										: "transparent",
									color: isActive ? colors.navy : "#64748b",
								}}
								onClick={item.action}
							>
								<Icon className="h-4 w-4" />
								<span>{item.label}</span>
							</button>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}
