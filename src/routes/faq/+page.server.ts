import { isUserModerator } from "$lib/server/auth/users";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	return { canEdit: isUserModerator(locals.user) };
}) satisfies PageServerLoad;
