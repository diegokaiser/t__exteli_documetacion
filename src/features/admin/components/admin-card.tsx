type AdminCardProps = {
	title: string;
	children: React.ReactNode;
};

export function AdminCard({ title, children }: AdminCardProps) {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="border-b border-slate-100 px-6 py-5">
				<h2 className="text-base font-semibold text-slate-900">{title}</h2>
			</div>

			<div className="p-6">{children}</div>
		</section>
	);
}
