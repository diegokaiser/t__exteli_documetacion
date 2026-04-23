import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";

const colors = {
	navy: "#0D3B66",
	lemon: "#FAF0CA",
};

export function AppShell({
	children,
	title,
	subtitle,
	showBack,
	onBack,
}: {
	children: React.ReactNode;
	title: string;
	subtitle?: string;
	showBack?: boolean;
	onBack?: () => void;
}) {
	return (
		<div
			className="min-h-screen w-full"
			style={{ backgroundColor: colors.lemon }}
		>
			<div className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-4 pb-8 pt-4 sm:px-6 md:px-8">
				<header className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{showBack ? (
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full"
								onClick={onBack}
								aria-label="Volver"
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
						) : (
							<div
								className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm"
								style={{ backgroundColor: colors.navy }}
							>
								<FileText className="h-5 w-5 text-white" />
							</div>
						)}
						<div>
							<p className="text-sm font-medium text-slate-500">
								Portal documental
							</p>
							<h1 className="text-lg font-semibold tracking-tight text-slate-900">
								{title}
							</h1>
						</div>
					</div>
					<Badge
						className="border-0 px-3 py-1 text-xs"
						style={{
							backgroundColor: "rgba(13,59,102,0.1)",
							color: colors.navy,
						}}
					>
						Seguro
					</Badge>
				</header>

				{subtitle ? (
					<p className="mb-5 text-sm leading-6 text-slate-600">{subtitle}</p>
				) : null}
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
