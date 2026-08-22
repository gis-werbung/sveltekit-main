import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as drizzle_pglite } from "drizzle-orm/pglite";
import { relations } from "./relations";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const normalDB = drizzle({ connection: { url: process.env.DATABASE_URL }, relations });
export let db: typeof normalDB;

if (env.USE_PGLITE === "true") {
	console.warn("[DB] Using PGlite in memory! The DB State will not be saved!");

	// @ts-ignore
	db = drizzle_pglite({ relations });
} else {
	db = drizzle({ connection: { url: process.env.DATABASE_URL }, relations });
}

export * from "./schema";
