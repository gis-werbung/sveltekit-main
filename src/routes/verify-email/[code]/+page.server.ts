import { validateEmailVerifyJWT } from "$lib/server/auth/email";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	const isCorrect = await validateEmailVerifyJWT(params.code);

	return { isCorrect };
}) satisfies PageServerLoad;
