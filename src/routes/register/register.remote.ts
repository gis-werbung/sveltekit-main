import { dev } from "$app/env";
import { form, getRequestEvent } from "$app/server";
import { sendVerificationEmail } from "$lib/server/auth/email";
import { createJWT } from "$lib/server/auth/jwt";
import { createUser } from "$lib/server/auth/users";
import { DBConflictError, handleDbError } from "$lib/server/db/errorHandling";
import { invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

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
			sendVerificationEmail(user);

			const token = await createJWT(user);
			const { cookies } = getRequestEvent();

			cookies.set("token", token, {
				httpOnly: true,
				secure: !dev,
				sameSite: "strict",
				path: "/",
				maxAge: 2592000
			});

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
		}
	}
);
