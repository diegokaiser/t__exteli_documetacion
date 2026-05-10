import type { PrepareDocumentsInput } from "./prepare-documents.schema";

type BuildDocumentsEmailBodyParams = {
	clientFullName: string;
	form: PrepareDocumentsInput;
};

function row(label: string, value?: string | null) {
	if (!value) return "";

	return `
		<tr>
			<td style="padding:6px 12px;font-weight:600;">${label}</td>
			<td style="padding:6px 12px;">${value}</td>
		</tr>
	`;
}

export function buildDocumentsEmailBody({
	clientFullName,
	form,
}: BuildDocumentsEmailBodyParams) {
	return `
		<div style="font-family:Arial,sans-serif;font-size:14px;color:#111827;">
			<p>Hola,</p>

			<p>Adjunto documentación preparada del cliente:</p>

			<table style="border-collapse:collapse;margin-top:12px;">
				${row("Nombres y apellidos", clientFullName)}
				${row("Dirección", form.address)}
				${row("Teléfono", form.phone)}
				${row("Correo electrónico", form.email)}
				${row("Estado civil", form.maritalStatus)}
				${row("Nombre del padre", form.fatherName)}
				${row("Nombre de la madre", form.motherName)}
				${row("EXP", form.expNumber)}
			</table>

			<p style="margin-top:16px;">Saludos.</p>
		</div>
	`;
}
