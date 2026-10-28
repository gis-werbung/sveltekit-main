import { form, getRequestEvent } from "$app/server";
import { isUserModerator } from "$lib/server/auth/users";
import { db, faqEntries } from "$lib/server/db";
import { isNumeric } from "$lib/utils";
import { error } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
import * as v from "valibot";

export const edit = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		description: v.optional(v.string()),
		content: v.pipe(v.string(), v.nonEmpty()),
		isPublic: v.optional(v.union([v.string(), v.boolean()]))
	}),
	async ({ title, description, content, isPublic }) => {
		const { locals, params } = getRequestEvent();
		const { user } = locals;
		if (!user || !isUserModerator(user)) error(403);

		if (!params.artid || !isNumeric(params.artid)) error(400);
		const artId = Number(params.artid);

		if (typeof isPublic === "string") isPublic = isPublic === "on";

		await db
			.update(faqEntries)
			.set({
				title,
				description,
				content,
				changedAt: sql`NOW()`,
				creatorUserId: user.id,
				public: isPublic || false
			})
			.where(eq(faqEntries.id, artId));
	}
);
