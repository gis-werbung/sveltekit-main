import * as d from "drizzle-orm/pg-core";

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
	isEmailVerified: d.boolean().default(false).notNull(),
	name: d.text().notNull().unique(),
	passwordHash: d.char({ length: 43 }).notNull(),
	status: accountStatusEnum().default("user").notNull(),
	balance: d.integer().default(0),

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
