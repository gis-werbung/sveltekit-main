import { command, getRequestEvent } from "$app/server";

export const logout = command(() => {
	const { cookies } = getRequestEvent();

	cookies.delete("token", { path: "/" });
});
