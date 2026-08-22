import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { isUserAdmin } from "$lib/server/auth/users";

export const load = (async ({ locals }) => {
	if (!isUserAdmin(locals.user)) error(403);
}) satisfies LayoutServerLoad;
