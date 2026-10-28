import { command, form, getRequestEvent, query } from "$app/server";
import { isUserModerator } from "$lib/server/auth/users";
import { db, faqEntries } from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as v from "valibot";

interface SearchResult {
	title: string;
	subtitle: string | null;
	author: string;
	lastChanged: string;
	id: number;
	public: boolean;
}

export const search = query(v.string(), async (searchTerm) => {
	// Wenn searchTerm === "" ist, werden alle Artikel gemeint
	const searchFn = db.query.faqEntries;

	const { locals } = getRequestEvent();
	const { user } = locals;
	const showOnlyPublic = !isUserModerator(user);

	let dbResults = await searchFn.findMany({
		with: { creator: true },
		where: { public: showOnlyPublic || undefined }
	});
	const lowerTerm = searchTerm.toLowerCase();

	if (searchTerm !== "") {
		dbResults = dbResults.filter(
			(v) =>
				v.title.toLowerCase().includes(lowerTerm) ||
				v.description?.toLowerCase().includes(lowerTerm)
		);
	}

	const result: SearchResult[] = dbResults.map((v) => {
		return {
			id: v.id,
			author: v.creator.name,
			lastChanged: v.createdAt.toLocaleDateString("de-DE"),
			subtitle: v.description,
			title: v.title,
			public: v.public
		};
	});

	return result;
});

export const createArticle = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty("Bitte gib einen Titel an")),
		description: v.optional(v.pipe(v.string()))
	}),
	async (data) => {
		const { locals } = getRequestEvent();
		const { user } = locals;
		if (!user || !isUserModerator(user)) error(403);

		const article = await db
			.insert(faqEntries)
			.values({ content: "Ein frischer Artikel", creatorUserId: user.id, ...data })
			.returning();

		redirect(303, "/app/moderator/faq-editor/" + article[0].id);
	}
);

export const toggleVisibilty = command(v.boolean(), async (isPublic) => {
	const { params } = getRequestEvent();
	if (!params.artid) error(400);

	const artId = Number(params.artid);
	await db.update(faqEntries).set({ public: isPublic }).where(eq(faqEntries.id, artId));
});
