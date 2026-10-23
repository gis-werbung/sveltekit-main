import { isNumeric } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { isUserModerator } from "$lib/server/auth/users";

export const load = (async ({ params, locals }) => {
	if (!isNumeric(params.artid)) error(400, "Invalid article id");
	const id = Number(params.artid);

	const { user } = locals;
	const canEdit = isUserModerator(user);
	const showOnlyPublic = !canEdit;

	const article = await db.query.faqEntries.findFirst({
		where: { id, public: showOnlyPublic || undefined },
		with: { creator: { columns: { name: true, id: true } } }
	});
	if (!article) error(404);

	return {
		lastChanged: article.changedAt.toLocaleDateString("de-DE"),
		title: article.title,
		description: article.description,
		content: article.content,
		creator: article.creator.name,
		creatorId: article.creator.id,
		canEdit,
		id
	};
}) satisfies PageServerLoad;
