import { assembleEmail, constructUrl } from "$lib/server/email";
import { VerifyEmail } from "$lib/mails";
import { createJWT, JWTTokenTypes, validateJWT } from "$lib/server/auth/jwt";
import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { insertAudit } from "$lib/server/audit";

const emailDataSchema = v.object({
	email: v.pipe(v.string(), v.nonEmpty(), v.email())
});
type EmailData = v.InferOutput<typeof emailDataSchema>;

export function createEmailVerifyJWT(user: DBTypes.OpenUser) {
	const emailData: EmailData = { email: user.email };

	return createJWT(user, JWTTokenTypes.EmailVerify, "30m", emailData);
}

export async function validateEmailVerifyJWT(jwt: string) {
	const result = await validateJWT(jwt, JWTTokenTypes.EmailVerify, emailDataSchema);
	if (!result) return false;
	if (result.user.email !== result.data.email) return false;

	await db.update(users).set({ isEmailVerified: true }).where(eq(users.id, result.user.id));
	await insertAudit({
		whatHappend: "verified",
		targetUserId: result.user.id,
		description: "Nutzer hat sich über E-Mail-Code verifiziert"
	});

	return true;
}

export async function sendVerificationEmail(user: DBTypes.OpenUser) {
	if (user.isEmailVerified) throw new Error("User is already verified");

	const verificationCode = await createEmailVerifyJWT(user);
	const verificationURL = constructUrl("verify-email/" + verificationCode);

	const sendEmail = await assembleEmail(VerifyEmail, user, { url: verificationURL });

	try {
		await sendEmail();
	} catch {
		throw new Error("Failed to send email");
	}
}
