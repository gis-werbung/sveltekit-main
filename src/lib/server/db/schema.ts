import * as d from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export const accountStatusEnum = d.pgEnum("account_status", [
	"user",
	"admin",
	"moderator",
	"banned"
]);

export const advertisementStatusEnum = d.pgEnum("advertisement_status", [
	"draft",
	"under_review",
	"accepted",
	"declined",
	"paused",
	"auto_paused"
]);

export const users = d.snakeCase.table("users", {
	id: d.serial().primaryKey(),
	email: d.text().notNull().unique(),
	name: d.text().notNull().unique(),
	passwordHash: d.char({ length: 43 }).notNull(),
	status: accountStatusEnum().default("user").notNull(),
	balance: d.integer(),

	createdAt: d.timestamp().defaultNow().notNull(),
	updatedAt: d.timestamp().defaultNow().notNull()
});

export const files = d.snakeCase.table("files", {
	id: d.serial().primaryKey(),
	path: d.text().unique().notNull(),
	ownerId: d.integer().notNull()
});

export const advertisements = d.snakeCase.table("advertisements", {
	id: d.serial().primaryKey(),
	title: d.text().notNull(),
	status: advertisementStatusEnum().default("draft").notNull(),

	isNonProfit: d.boolean().notNull(),
	longUpgradeBooked: d.boolean().notNull(),
	videoUpgradeBooked: d.boolean().notNull(),

	ownerId: d.integer().notNull(),
	fileId: d.integer().notNull()
});

export const adSupportChat = d.snakeCase.table("ad_support_chat", {
	advertisementId: d.integer().primaryKey()
});

export const supportMessage = d.snakeCase.table("message", {
	authorId: d.integer().notNull(),
	chatId: d.integer().notNull(),
	sendAt: d.timestamp().defaultNow().notNull(),
	content: d.text().notNull()
});

export const relations = defineRelations(
	{ users, files, advertisements, adSupportChat, supportMessage },
	(r) => ({
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
			}),
			supportChat: r.one.adSupportChat({
				from: r.advertisements.id,
				to: r.adSupportChat.advertisementId,
				optional: false,
				alias: "ad-support-chat"
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
		supportMessage: {
			chat: r.one.adSupportChat({
				from: r.supportMessage.chatId,
				to: r.adSupportChat.advertisementId,
				optional: false,
				alias: "ad-support-message"
			})
		},
		adSupportChat: {
			advertisement: r.one.advertisements({ alias: "ad-support-chat" }),
			messages: r.many.supportMessage({ alias: "ad-support-message" })
		}
	})
);
