import { validateEmailVerifyJWT } from "$lib/server/auth/email";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
	const isCorrect = await validateEmailVerifyJWT(params.code);

	return { isCorrect, isLoggedIn: locals.user !== undefined };
}) satisfies PageServerLoad;
