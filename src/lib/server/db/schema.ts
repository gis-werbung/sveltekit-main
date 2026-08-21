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

export const supportStatusEnum = d.pgEnum("support_status", [
	"open",
	"resolved",
	"closed",
	"answered_in_faq"
]);

export const supportMessageStatusEnum = d.pgEnum("support_message_status", [
	"awaitingUserResponse",
	"awaitingModResponse"
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
	fileId: d.integer().notNull(),

	createdAt: d.timestamp().defaultNow().notNull(),
	// Users can set a date on which the status will automatically be set to "accepted" if it is paused
	launchAt: d.timestamp(),
	// Users can set an expiary on which the ad will not be shown anymore and the subscription will be cancelled
	expireAt: d.timestamp()
});

export const supportChat = d.snakeCase.table("support_chat", {
	id: d.serial().primaryKey(),
	openedAt: d.timestamp().defaultNow().notNull(),
	closedAt: d.timestamp(),
	authorID: d.integer().notNull(),
	status: supportStatusEnum().default("open").notNull(),
	messageStatus: supportMessageStatusEnum()
});

export const supportMessage = d.snakeCase.table("message", {
	authorId: d.integer().notNull(),
	chatId: d.integer().notNull(),
	sendAt: d.timestamp().defaultNow().notNull(),
	content: d.text().notNull()
});

export const relations = defineRelations(
	{ users, files, advertisements, supportMessage, supportChat },
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
	})
);
