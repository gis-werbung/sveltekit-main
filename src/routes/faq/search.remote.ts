import { command, getRequestEvent, query } from "$app/server";
import { db, faqEntries } from "$lib/server/db";
import { sql } from "drizzle-orm";
import * as v from "valibot";

interface SearchResult {
	title: string;
	subtitle: string | null;
	author: string;
	lastChanged: string;
	id: number;
}

export const search = query(v.string(), async (searchTerm) => {
	// Wenn searchTerm === "" ist, werden alle Artikel gemeint
	const searchFn = db.query.faqEntries;

	let dbResults = await searchFn.findMany({ with: { creator: true } });
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
			title: v.title
		};
	});

	return result;
});
