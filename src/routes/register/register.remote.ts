import { form } from "$app/server";
import { sendVerificationEmail } from "$lib/server/email/verifyEmail";
import { setLoginCookie } from "$lib/server/auth/jwt";
import { createUser } from "$lib/server/auth/users";
import { DBConflictError, handleDbError } from "$lib/server/db/errorHandling";
import { invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";
import { auditLog, db } from "$lib/server/db";
import { getIdentBundle, getIdentText } from "$lib/server/identification";
import { insertAudit } from "$lib/server/audit";

export const register = form(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty("Bitte gib deinen Namen an")),
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib eine E-Mail an"),
			v.email("Bitte gib eine gültige E-Mail an"),
			v.endsWith(
				"iserv-gis.de",
				"Derzeit erlauben wir nur Registrationen mit schulinternen E-Mail-Adressen"
			)
		),
		_password: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib ein Passwort ein"),
			v.minLength(8, "Dein Passwort muss mindestens 8 Zeichen haben")
		),
		_repeatPassword: v.pipe(v.string(), v.nonEmpty("Bitte gib das Passwort erneut ein"))
	}),
	async ({ name, email, _password, _repeatPassword }, issue) => {
		try {
			if (_password !== _repeatPassword) {
				return invalid(issue._repeatPassword("Die Passwörter stimmen nicht überein"));
			}

			const user = await createUser({ name, email, password: _password });

			await insertAudit({
				whatHappend: "created",
				targetUserId: user.id,
				description: "Nutzer wurde über Registrierungs-Seite erstellt"
			});
			await setLoginCookie(user);

			try {
				await sendVerificationEmail(user);
			} catch {
				redirect(303, "/verify-email?errored=true");
			}
			redirect(303, "/app");
		} catch (e) {
			const dbError = handleDbError(e);

			if (dbError instanceof DBConflictError) {
				switch (dbError.conflict) {
					case "email":
						return invalid(issue.email("Die E-Mail wird bereits verwendet"));
					case "name":
						return invalid(issue.name("Ein Konto mit dem selben Namen existiert bereits"));
				}
			}
			throw e;
		}
	}
);
