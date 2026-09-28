import { query } from "$app/server";
import { db } from "$lib/server/db";
import * as v from "valibot";

interface SearchResult {
	title: string;
	subtitle: string | null;
	author: string;
	lastChanged: string;
	id: number;
}

export const search = query(v.string(), async (searchTerm) => {
	const settings = {
		with: { creator: true }
	};

	if (searchTerm) {
		// @ts-ignore
		settings.where = { title: { like: searchTerm } };
	}

	// Wenn searchTerm === "" ist, werden alle Artikel gemeint
	const dbResults = await db.query.faqEntries.findMany(settings);

	const result: SearchResult[] = dbResults.map((v) => {
		return {
			id: v.id,
			author: v.creator.name,
			lastChanged: v.createdAt.toLocaleDateString("de-DE"),
			subtitle: v.description,
			title: v.title
		};
	});

	return result;
});
