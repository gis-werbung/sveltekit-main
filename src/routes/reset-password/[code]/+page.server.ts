import { JWTTokenTypes, validateJWT } from "$lib/server/auth/jwt";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	const result = validateJWT(params.code, JWTTokenTypes.ResetPassword);
	if (!result) error(403);
}) satisfies PageServerLoad;
