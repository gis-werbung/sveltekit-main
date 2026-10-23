import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ parent }) => {
	const { isAdmin } = await parent();
	if (!isAdmin) error(403);
}) satisfies LayoutServerLoad;
