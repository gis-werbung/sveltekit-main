import { validateEmailVerifyJWT } from "$lib/server/email/emailVerify";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
	const isLoggedIn = locals.user !== undefined;
	const isAlreadyVerified = locals.user?.isEmailVerified;

	const isCorrect = isAlreadyVerified || (await validateEmailVerifyJWT(params.code));

	return { isCorrect, isLoggedIn, isAlreadyVerified };
}) satisfies PageServerLoad;
