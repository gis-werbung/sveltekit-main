import { form, getRequestEvent } from "$app/server";
import { insertAudit } from "$lib/server/audit";
import { setLoginCookie } from "$lib/server/auth/jwt";
import { db, users } from "$lib/server/db";
import { sendPasswordChangedEmail } from "$lib/server/email/emailChanged";
import { error, invalid } from "@sveltejs/kit";
import { hash, verify } from "argon2";
import { eq, sql } from "drizzle-orm";
import * as v from "valibot";

export const changePassword = form(
	v.object({
		_current: v.pipe(v.string(), v.nonEmpty("Bitte gib dein aktuelles Passwort ein")),
		_new: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib ein Passwort ein"),
			v.minLength(8, "Dein Passwort muss mindestens 8 Zeichen haben")
		),
		_repeat: v.pipe(v.string(), v.nonEmpty("Bitte wiederhole dein aktuelles Passwort"))
	}),
	async ({ _current, _new, _repeat }, issue) => {
		if (_new !== _repeat) invalid(issue._repeat("Die Passwörter stimmen nicht überein"));

		const { locals } = getRequestEvent();
		if (!locals.user) error(403);

		if (!(await verify(locals.user.passwordHash, _current))) {
			invalid(issue._current("Das Passwort stimmt nicht mit dem Aktuellen überein"));
		}

		if (_new === _current) {
			invalid(issue._new("Das neue Passwort kann nicht das selbe wie das Alte sein"));
		}

		const passwordHash = await hash(_new);
		const user = (
			await db
				.update(users)
				.set({ passwordHash, updatedAt: sql`NOW()` })
				.where(eq(users.id, locals.user.id))
				.returning()
		)[0];

		await insertAudit({
			whatHappend: "modified",
			targetUserId: user.id,
			description: "Passwort wurde über User-Panel geändert"
		});
		await sendPasswordChangedEmail(user);
		await setLoginCookie(user);
	}
);
