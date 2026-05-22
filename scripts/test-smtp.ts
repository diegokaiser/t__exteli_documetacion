import nodemailer from "nodemailer";

const user = "documentacion.extranjeriaeli@gmail.com";
const rawPass = "mblkbzftqljohqes";

const pass = rawPass.replace(/\s/g, "").trim();

console.log({
	user,
	rawLength: rawPass.length,
	cleanLength: pass.length,
	hasWhitespace: /\s/.test(rawPass),
});

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "login",
		user,
		pass,
	},
});

async function main() {
	await transporter.verify();

	await transporter.sendMail({
		from: `"Portal Documentos" <${user}>`,
		to: "extranjeriaeli@gmail.com",
		subject: "Test SMTP",
		text: "Correo de prueba",
	});

	console.log("OK");
}

main().catch(console.error);
