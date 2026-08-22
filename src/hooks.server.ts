import type { Handle } from "@sveltejs/kit";
import { validateJWT } from "$lib/server/auth/jwt";

export const handle: Handle = async ({ event, resolve }) => {
	// Auth

	const jwt = event.cookies.get("token");
	if (jwt) {
		const user = await validateJWT(jwt);
		event.locals.user = user?.user;
	}

	return await resolve(event);
};
