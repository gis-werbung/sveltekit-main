import { command, form, getRequestEvent } from "$app/server";
import { sendVerificationEmail } from "$lib/server/auth/email";
import { db, users } from "$lib/server/db";
import { error, invalid, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import * as v from "valibot";

export const resendEmailCode = command(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user) error(403);

	await sendVerificationEmail(locals.user);
});

export const changeEmail = form(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib eine neue E-Mail an"),
			v.email("Bitte gib eine gültige neue E-Mail an"),
			v.endsWith(
				"iserv-gis.de",
				"Derzeit erlauben wir nur Registrationen mit schulinternen E-Mail-Adressen"
			)
		)
	}),
	async ({ email }, issue) => {
		const { locals } = getRequestEvent();
		if (!locals.user) error(403);

		if (locals.user.email === email) {
			invalid(issue.email("Die neue E-Mail kann nicht die Alte sein"));
		}

		await db
			.update(users)
			.set({ email })
			.where(and(eq(users.id, locals.user.id), eq(users.isEmailVerified, false)));

		locals.user.email = email;

		console.log("New mail", locals.user.email);
		try {
			await sendVerificationEmail(locals.user);
		} catch {
			error(500, "Failed to send E-Mail");
		}
	}
);
