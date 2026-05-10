// src/lib/email/send-documents-email.ts
import nodemailer from "nodemailer";

type SendDocumentsEmailParams = {
	to: string;
	subject: string;
	html: string;
	zipBuffer: Uint8Array;
	filename: string;
};

export async function sendDocumentsEmail({
	to,
	subject,
	html,
	zipBuffer,
	filename,
}: SendDocumentsEmailParams) {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST!,
		port: Number(process.env.SMTP_PORT ?? 465),
		secure: process.env.SMTP_SECURE === "true",
		auth: {
			user: process.env.SMTP_USER!,
			pass: process.env.SMTP_APP_PASSWORD!,
		},
	});

	await transporter.sendMail({
		from: `"Portal Documental" <${process.env.SMTP_USER}>`,
		to,
		subject,
		html,
		attachments: [
			{
				filename,
				content: Buffer.from(zipBuffer),
				contentType: "application/zip",
			},
		],
	});
}
