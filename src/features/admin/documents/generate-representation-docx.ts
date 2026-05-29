import type { CreateClientInput } from "@/features/admin/clients/create-client.schema";
import Docxtemplater from "docxtemplater";
import fs from "node:fs/promises";
import path from "node:path";
import PizZip from "pizzip";
import { getRepresentationTramite } from "./representation-tramite.config";

function getHonorific(genre: "female" | "male") {
	return genre === "female" ? "DOÑA" : "DON";
}

function getGuardianRole(genre: "female" | "male") {
	return genre === "female" ? "madre" : "padre";
}

function formatSpanishDate(date = new Date()) {
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

function normalizeFilename(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9\s-_]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.toUpperCase();
}

export function buildRepresentationFilename(input: CreateClientInput) {
	const fullName = `${input.firstName} ${input.lastName}`.trim();

	if (input.age === "minor") {
		return `REPRESENTACION-MENOR-${normalizeFilename(fullName)}.docx`;
	}

	return `REPRESENTACION-${normalizeFilename(fullName)}.docx`;
}

export async function generateRepresentationDocx(input: CreateClientInput) {
	const fullName = `${input.firstName} ${input.lastName}`.trim();

	const templateFilename =
		input.age === "minor"
			? "REPRESENTACION-MENORES.docx"
			: "REPRESENTACION.docx";

	const templatePath = path.join(
		process.cwd(),
		"public",
		"templates",
		templateFilename,
	);

	const templateBuffer = await fs.readFile(templatePath);
	const zip = new PizZip(templateBuffer);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
		delimiters: { start: "{{", end: "}}" },
	});

	if (input.age === "minor") {
		const guardianFullName =
			`${input.guardianFirstName} ${input.guardianLastName}`.trim();

		doc.render({
			MAYOR_GENERO: getHonorific(input.guardianGenre!),
			MAYOR_NOMBRE: guardianFullName,
			MAYOR_TIPO_DOCUMENTO: input.guardianDocumentType?.toUpperCase() ?? "",
			MAYOR_NUMERO_DOCUMENTO: input.guardianDocumentNumber ?? "",
			APODERADO: getGuardianRole(input.guardianGenre!),
			MENOR_NOMBRE: fullName,
			MENOR_TIPO_DOCUMENTO: input.documentType?.toUpperCase() ?? "",
			MENOR_NUMERO_DOCUMENTO: input.documentNumber ?? "",
			FECHA_ACTUAL: formatSpanishDate(),
			TRAMITE: getRepresentationTramite(input.caseName),
		});
	} else {
		doc.render({
			GENERO: getHonorific(input.genre),
			NOMBRE: fullName,
			TIPO_DOCUMENTO: input.documentType?.toUpperCase() ?? "",
			NUMERO_DOCUMENTO: input.documentNumber ?? "",
			FECHA_ACTUAL: formatSpanishDate(),
			TRAMITE: getRepresentationTramite(input.caseName),
		});
	}

	return doc.getZip().generate({
		type: "nodebuffer",
		compression: "DEFLATE",
	});
}
