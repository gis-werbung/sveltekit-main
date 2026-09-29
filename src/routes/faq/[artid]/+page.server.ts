import { isNumeric } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load = (async ({ params }) => {
	if (!isNumeric(params.artid)) error(400, "Invalid article id");
	const id = Number(params.artid);

	const article = await db.query.faqEntries.findFirst({
		where: { id },
		with: { creator: { columns: { name: true } } }
	});
	if (!article) error(404);

	return {
		lastChanged: article.changedAt.toLocaleDateString("de-DE"),
		title: article.title,
		description: article.description,
		content: article.content,
		creator: article.creator.name
	};
}) satisfies PageServerLoad;
