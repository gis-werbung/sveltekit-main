import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	return { isLoggedIn: locals.user !== undefined, title: locals.user?.name, id: locals.user?.id };
}) satisfies PageServerLoad;
