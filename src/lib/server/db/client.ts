import { drizzle } from "drizzle-orm/postgres-js";
import { relations } from "./schema";

export const db = drizzle({ connection: { url: process.env.DATABASE_URL }, relations });
