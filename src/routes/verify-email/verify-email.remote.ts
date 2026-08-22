import { command, getRequestEvent } from "$app/server";
import { sendVerificationEmail } from "$lib/server/auth/email";
import { error } from "@sveltejs/kit";

export const resendEmailCode = command(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user) error(403);

	await sendVerificationEmail(locals.user);
});
