import { isNumeric } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// TODO: Hier Artikelinhalt laden
export const load = (async ({ params }) => {
	if (!isNumeric(params.artid)) error(400, "Invalid article id");
	const artid = Number(params.artid);

	return {};
}) satisfies PageServerLoad;
