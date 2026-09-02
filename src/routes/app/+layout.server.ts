import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { isUserAdmin, isUserModerator } from "$lib/server/auth/users";

const disableEmailVerification = env.SKIP_EMAIL_VERIFICATION === "true";
if (disableEmailVerification) console.warn("SkipEmailVerification is enabled");

export const load = (async ({ locals }) => {
	const user = locals.user;

	if (!user) redirect(307, "/login");

	if (!user.isEmailVerified) {
		if (disableEmailVerification) {
			await db.update(users).set({ isEmailVerified: true }).where(eq(users.id, user.id));
		} else {
			redirect(307, "/verify-email");
		}
	}

	const isModerator = isUserModerator(user)!;
	const isAdmin = isUserAdmin(user)!;

	return { user: locals.user!, isModerator, isAdmin };
}) satisfies LayoutServerLoad;
