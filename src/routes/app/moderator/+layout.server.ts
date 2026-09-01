import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { isUserModerator } from "$lib/server/auth/users";

export const load = (async ({ locals }) => {
	if (!isUserModerator(locals.user)) error(403);
}) satisfies LayoutServerLoad;
