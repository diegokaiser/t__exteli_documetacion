type AdminCardProps = {
	title: string;
	children: React.ReactNode;
	type?: string;
};

export function AdminCard({ title, children, type }: AdminCardProps) {
	return (
		<section
			className={`rounded-2xl border  ${
				type === "sub"
					? "bg-[#FAF0CA] border-dashed border-slate-400 mb-6"
					: "bg-white border-slate-200 shadow-sm"
			}`}
		>
			<div
				className={`px-6 py-5 ${
					type === "sub"
						? "border-b border-slate-400"
						: "border-b border-slate-100"
				}`}
			>
				<h2 className="text-base font-semibold text-slate-900">{title}</h2>
			</div>

			<div className="p-6">{children}</div>
		</section>
	);
}
