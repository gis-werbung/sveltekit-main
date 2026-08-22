import type { Handle } from "@sveltejs/kit";
import { validateJWT } from "$lib/server/auth/jwt";

export const handle: Handle = async ({ event, resolve }) => {
	// Auth

	const jwt = event.cookies.get("token");
	if (jwt) {
		const result = await validateJWT(jwt);

		if (result) {
			event.locals.user = result.user;
		} else {
			event.cookies.delete("token", { path: "/" });
		}
	}

	return await resolve(event);
};
