import { writable } from "svelte/store";

interface PathEntry {
	title: string;
	href?: string;
}

export function addToPath(title: PathEntry) {
	pagePath.update((v) => {
		v.push(title);
		return v;
	});
}

export function replaceTitle(newTitle: string) {
	pagePath.update((v) => {
		const entry = v.at(-1);
		if (entry) entry.title = newTitle;
		return v;
	});
}

export function clearPath() {
	pagePath.set([]);
}

export const pagePath = writable<PathEntry[]>([]);
