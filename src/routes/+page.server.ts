import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	return { title: locals.user?.name, id: locals.user?.id };
}) satisfies PageServerLoad;
