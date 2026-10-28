import { db, users } from "$lib/server/db";
import { eq, sql } from "drizzle-orm";
import { hash } from "argon2";

export async function createUser({
	email,
	password,
	name
}: {
	email: string;
	password: string;
	name: string;
}) {
	const passwordHash = await hash(password);

	const result = await db
		.insert(users)
		.values({ email, name, passwordHash })
		.onConflictDoUpdate({
			target: users.email,
			targetWhere: eq(users.status, "deleted"),
			set: {
				status: "user",
				email,
				name,
				passwordHash,
				updatedAt: sql`NOW()`,
				createdAt: sql`NOW()`
			}
		})
		.returning();
	return result[0];
}

export async function changePassword(id: number, newPassword: string) {
	const passwordHash = await hash(newPassword);

	await db.update(users).set({ passwordHash }).where(eq(users.id, id));
}

export function isUserModerator(user: DBTypes.OpenUser | undefined) {
	return user && (user.status === "moderator" || user.status === "admin");
}
export function isUserAdmin(user: DBTypes.OpenUser | undefined) {
	return user && user.status === "admin";
}
export function isUserBanned(user: DBTypes.OpenUser | undefined) {
	return user && (user.status === "banned" || user.status === "deleted");
}
