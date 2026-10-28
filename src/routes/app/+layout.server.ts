import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";

const disableEmailVerification = env.SKIP_EMAIL_VERIFICATION === "true";
if (disableEmailVerification) console.warn("SkipEmailVerification is enabled");

export const load = (async ({ locals }) => {
	if (!locals.user) redirect(307, "/login");
	if (!locals.user.isEmailVerified) {
		if (disableEmailVerification) {
			await db.update(users).set({ isEmailVerified: true }).where(eq(users.id, locals.user.id));
		} else {
			redirect(307, "/verify-email");
		}
	}

	return { user: locals.user! };
}) satisfies LayoutServerLoad;
