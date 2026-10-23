import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ parent }) => {
	const { isModerator } = await parent();
	if (!isModerator) error(403);
}) satisfies LayoutServerLoad;
