import { ForgotPassword } from "$lib/mails";
import { createJWT, JWTTokenTypes } from "$lib/server/auth/jwt";
import { assembleEmail, constructUrl } from "$lib/server/email";

export function createPasswordResetJWT(user: DBTypes.OpenUser) {
	return createJWT(user, JWTTokenTypes.ResetPassword, "10m");
}

export async function sendResetPasswordEmail(user: DBTypes.OpenUser) {
	const resetCode = await createPasswordResetJWT(user);
	const resetURL = constructUrl("reset-password/" + resetCode);

	const sendEmail = await assembleEmail(ForgotPassword, user, { url: resetURL });

	try {
		await sendEmail();
	} catch {
		throw new Error("Failed to send email");
	}
}
