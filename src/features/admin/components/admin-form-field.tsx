type AdminFormFieldProps = {
	label: string;
	error?: string;
	children: React.ReactNode;
};

export function AdminFormField({
	label,
	error,
	children,
}: AdminFormFieldProps) {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-slate-700">{label}</label>

			{children}

			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}
