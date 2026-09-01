import { form, getRequestEvent } from "$app/server";
import { insertAudit } from "$lib/server/audit";
import { JWTTokenTypes, setLoginCookie, validateJWT } from "$lib/server/auth/jwt";
import { db, users } from "$lib/server/db";
import { sendPasswordChangedEmail } from "$lib/server/email/emailChanged";
import { error, invalid } from "@sveltejs/kit";
import { hash } from "argon2";
import { eq, sql } from "drizzle-orm";
import * as v from "valibot";

export const resetPassword = form(
	v.object({
		_password: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib ein Passwort ein"),
			v.minLength(8, "Dein Passwort muss mindestens 8 Zeichen haben")
		),
		_repeatPassword: v.pipe(v.string(), v.nonEmpty("Bitte gib das Passwort erneut ein"))
	}),
	async ({ _password, _repeatPassword }, issue) => {
		if (_password !== _repeatPassword) {
			return invalid(issue._repeatPassword("Die Passwörter stimmen nicht überein"));
		}

		const { params } = getRequestEvent();
		const result = await validateJWT(params.code!, JWTTokenTypes.ResetPassword);
		if (!result) error(403);

		const passwordHash = await hash(_password);

		const user = (
			await db
				.update(users)
				.set({ passwordHash, updatedAt: sql`NOW()` })
				.where(eq(users.id, result.user.id))
				.returning()
		)[0];

		await insertAudit({
			whatHappend: "modified",
			targetUserId: user.id,
			description: "Passwort wurde über ein Zurücksetzungslink geändert"
		});
		await sendPasswordChangedEmail(user);
		await setLoginCookie(user);
	}
);
