import { users } from "$lib/server/db";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: DBTypes.OpenUser;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace DBTypes {
		type OpenUser = Omit<typeof users.$inferSelect, "passwordHash">;
	}
}

export {};
