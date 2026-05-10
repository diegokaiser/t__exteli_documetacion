const colors = {
	navy: "#0D3B66",
	lemon: "#FAF0CA",
};

export function SplashLoader({
	message = "Cargando...",
}: {
	message?: string;
}) {
	return (
		<div
			className="flex min-h-screen items-center justify-center"
			style={{ backgroundColor: colors.lemon }}
		>
			<div className="flex flex-col items-center gap-4">
				<div
					className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"
					style={{ borderTopColor: colors.navy }}
				/>
				<p className="text-sm font-medium text-slate-700">{message}</p>
			</div>
		</div>
	);
}
