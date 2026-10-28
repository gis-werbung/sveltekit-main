import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isNumeric } from "$lib/utils";

export const load = (async ({ params, locals }) => {
	if (!isNumeric(params.artid)) error(400, "Invalid article id");
	const id = Number(params.artid);

	const article = await db.query.faqEntries.findFirst({ where: { id } });
	if (!article) error(404);

	return {
		title: article.title,
		description: article.description,
		content: article.content,
		isPublic: article.public,
		id
	};
}) satisfies PageServerLoad;
