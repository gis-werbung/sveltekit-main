import { dev } from "$app/env";
import { form, getRequestEvent } from "$app/server";
import { createJWT } from "$lib/server/auth/jwt";
import { isUserBanned } from "$lib/server/auth/users";
import { db } from "$lib/server/db";
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
		_password: v.pipe(v.string(), v.nonEmpty("Bitte gib ein Password ein"))
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
			return invalid("Ihr Konto ist gesperrt. Bitte schau in deinem E-Mail-Postfach nach");
		}

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
	}
);
