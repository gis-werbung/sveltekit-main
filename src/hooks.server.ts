import type { Handle } from "@sveltejs/kit";
import { validateJWT } from "$lib/server/auth/jwt";
import { isUserBanned } from "$lib/server/auth/users";

export const handle: Handle = async ({ event, resolve }) => {
	// Auth

	const jwt = event.cookies.get("token");
	if (jwt) {
		const result = await validateJWT(jwt);
		const shouldDelete = !result || isUserBanned(result.user);

		if (shouldDelete) {
			event.cookies.delete("token", { path: "/" });
		} else if (result) {
			event.locals.user = result.user;
		}
	}

	return await resolve(event);
};
