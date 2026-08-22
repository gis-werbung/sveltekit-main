import verifyText from "$lib/texts/verifyEmail.txt?raw";
import verifyHTML from "$lib/texts/verifyEmail.html.txt?raw";
import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { createJWT, JWTTokenTypes, validateJWT } from "./jwt";
import { env } from "$env/dynamic/private";
import { createTransport } from "nodemailer";
import * as v from "valibot";

const emailDataSchema = v.object({
	email: v.pipe(v.string(), v.nonEmpty(), v.email())
});
type EmailData = v.InferOutput<typeof emailDataSchema>;

if (!env.SITE_HOME_URL) throw new Error("SITE_HOME_URL is not set");
if (!env.SMTP_HOST) throw new Error("SMTP_HOST is not set");
if (!env.SMTP_PASS) throw new Error("SMTP_PASS is not set");
if (!env.SMTP_USER) throw new Error("SMTP_USER is not set");

export const emailTransport = createTransport({
	host: env.SMTP_HOST,
	port: 465,
	secure: true,
	auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
});

export function createEmailVerifyJWT(user: DBTypes.OpenUser) {
	const emailData: EmailData = { email: user.email };

	return createJWT(user, JWTTokenTypes.EmailVerify, "30m", emailData);
}

export async function validateEmailVerifyJWT(jwt: string) {
	const result = await validateJWT(jwt, JWTTokenTypes.EmailVerify, emailDataSchema);
	if (!result) return false;
	if (result.user.email !== result.data.email) return false;

	await db.update(users).set({ isEmailVerified: true }).where(eq(users.id, result.user.id));

	return true;
}

export async function sendVerificationEmail(user: DBTypes.OpenUser) {
	if (user.isEmailVerified) throw new Error("User is already verified");

	const verificationCode = await createEmailVerifyJWT(user);
	const verificationURL = env.SITE_HOME_URL + "verify-email/" + verificationCode;

	const text = verifyText.replaceAll("{{name}}", user.name).replaceAll("{{url}}", verificationURL);
	const html = verifyHTML.replaceAll("{{name}}", user.name).replaceAll("{{url}}", verificationURL);

	try {
		await emailTransport.sendMail({
			from: '"GiS Werbung" <noreply@gis-werbung.de>',
			to: user.email,
			subject: "Bestätige deine E-Mail",
			html,
			text
		});
	} catch {
		throw new Error("Failed to send email");
	}
}
