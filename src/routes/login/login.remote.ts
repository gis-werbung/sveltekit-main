import { form } from "$app/server";
import { setLoginCookie } from "$lib/server/auth/jwt";
import { isUserBanned } from "$lib/server/auth/users";
import { db } from "$lib/server/db";
import { sendResetPasswordEmail } from "$lib/server/email/forgotPassword";
import { invalid, redirect } from "@sveltejs/kit";
import { verify } from "argon2";
import * as v from "valibot";

export const login = form(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib eine E-Mail an"),
			v.email("Bitte gib eine gültige E-Mail an")
		),
		_password: v.pipe(v.string(), v.nonEmpty("Bitte gib ein Passwort ein"))
	}),
	async ({ email, _password }, issue) => {
		const user = await db.query.users.findFirst({ where: { email } });
		if (!user) {
			return invalid(issue.email("Mit dieser E-Mail-Adresse ist kein Konto verknüpft"));
		}

		const valid = await verify(user.passwordHash, _password);
		if (!valid) {
			return invalid(issue._password("Das Passwort ist ungültig"));
		}

		if (isUserBanned(user)) {
			return invalid("Dein Konto ist gesperrt. Bitte schau in deinem E-Mail-Postfach nach");
		}

		await setLoginCookie(user);

		redirect(303, "/app");
	}
);

export const resetPassword = form(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib deine E-Mail an"),
			v.email("Bitte gib eine gültige E-Mail an")
		)
	}),
	async ({ email }, issue) => {
		const user = await db.query.users.findFirst({ where: { email } });
		if (!user) {
			return invalid(issue.email("Mit dieser E-Mail-Adresse ist kein Konto verknüpft"));
		}

		await sendResetPasswordEmail(user);
	}
);
