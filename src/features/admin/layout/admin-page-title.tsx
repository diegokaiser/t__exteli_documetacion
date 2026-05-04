type AdminPageTitleProps = {
	title: string;
	description?: string;
	breadcrumbs?: string[];
};

export function AdminPageTitle({
	title,
	description,
	breadcrumbs = [],
}: AdminPageTitleProps) {
	return (
		<div className="mb-8">
			{breadcrumbs.length > 0 && (
				<div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
					{breadcrumbs.map((item, index) => (
						<span key={item} className="flex items-center gap-2">
							{item}
							{index < breadcrumbs.length - 1 && <span>/</span>}
						</span>
					))}
				</div>
			)}

			<h1 className="text-3xl font-bold tracking-tight text-slate-900">
				{title}
			</h1>

			{description && (
				<p className="mt-2 text-sm text-slate-500">{description}</p>
			)}
		</div>
	);
}
