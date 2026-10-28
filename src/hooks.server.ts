import type { Handle, ServerInit } from "@sveltejs/kit";
import { validateJWT } from "$lib/server/auth/jwt";
import { isUserBanned } from "$lib/server/auth/users";
import { configureLogger } from "$lib/logger";
import { getLogger } from "@logtape/logtape";
import { dev } from "$app/env";

const logger = getLogger(["gis-werbung", "hooks"]);

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

export const init: ServerInit = async () => {
	await configureLogger();
	logger.info("Server has restarted");
	if (dev) logger.info("Server is running in dev mode");
};
