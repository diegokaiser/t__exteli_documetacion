const MIME_TYPE_LABELS: Record<string, string> = {
	"application/pdf": "PDF",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		"DOCX",
	"application/msword": "DOC",
	"image/jpeg": "JPG",
	"image/png": "PNG",
};

const MIME_TYPE_EXTENSIONS: Record<string, string> = {
	"application/pdf": ".pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		".docx",
	"application/msword": ".doc",
	"image/jpeg": ".jpg,.jpeg",
	"image/png": ".png",
};

function formatAcceptedTypes(accept?: string[]) {
	if (!accept || accept.length === 0) return undefined;

	return accept.map((type) => MIME_TYPE_EXTENSIONS[type] ?? type).join(",");
}

function getReadableAcceptedTypes(accept?: string[]) {
	if (!accept || accept.length === 0) return "Formato no especificado";

	const labels = accept.map((type) => MIME_TYPE_LABELS[type] ?? type);

	return `Solo ${labels.join(", ")}`;
}
