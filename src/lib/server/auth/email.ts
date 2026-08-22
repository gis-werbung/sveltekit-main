import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { createJWT, JWTTokenTypes, validateJWT } from "./jwt";
import * as v from "valibot";

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

	return true;
}
