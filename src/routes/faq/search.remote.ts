import { query } from "$app/server";
import * as v from "valibot";

interface SearchResult {
	title: string;
	subtitle: string;
	author: string;
	lastChanged: string;
	id: number;
}

export const search = query(v.string(), async (searchTerm) => {
	// Wenn searchTerm === "" ist, werden alle Artikel gemeint

	const result: SearchResult[] = [
		{
			title: "Ich bin ein Artikel",
			subtitle: "Ich bin der beste!",
			author: "Meine Wenigkeit",
			lastChanged: "13.13.1333",
			id: 1
		},
		{
			title: "Ich bin noch ein Artikel",
			subtitle: "Nein, ich bin der beste!",
			author: "Deine Wenigkeit",
			lastChanged: "39.12.2026",
			id: 2
		},
		{
			title: "Nö",
			subtitle: "Erwartest du was kreatives?",
			author: "Niemand",
			lastChanged: "11.12.2026",
			id: 2
		}
	];

	if (searchTerm) {
		result.push({
			author: "Ein Roboter",
			id: 3,
			title: "Ich bin in der Suche dabei!",
			subtitle: "Suche mich: " + searchTerm,
			lastChanged: "Jetzt"
		});
	}

	return result;
});
