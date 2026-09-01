import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	advertisements: {
		owner: r.one.users({
			from: r.advertisements.ownerId,
			to: r.users.id,
			optional: false,
			alias: "owner"
		}),
		file: r.one.files({
			from: r.advertisements.fileId,
			to: r.files.id,
			optional: false,
			alias: "file-usage"
		})
	},
	files: {
		owner: r.one.users({
			from: r.files.ownerId,
			to: r.users.id,
			optional: false,
			alias: "file-owner"
		}),
		advertisements: r.many.advertisements({ alias: "file-usage" })
	},
	users: {
		advertisements: r.many.advertisements({ alias: "owner" }),
		files: r.many.files({ alias: "file-owner" })
	},
	supportChat: {
		messages: r.many.supportMessage({ alias: "support-messages" })
	},
	supportMessage: {
		chat: r.one.supportChat({
			from: r.supportMessage.chatId,
			to: r.supportChat.id,
			optional: false,
			alias: "support-messages"
		})
	}
}));
