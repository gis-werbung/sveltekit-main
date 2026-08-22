import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (!locals.user) redirect(307, "/login");
	if (!locals.user.isEmailVerified) redirect(307, "/verify-email");
}) satisfies LayoutServerLoad;
