import { env } from "$env/dynamic/private";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { db, type users } from "$lib/server/db";
import * as v from "valibot";

if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not set");

const jwtSecretKey = new TextEncoder().encode(env.JWT_SECRET);

const genericJWTSchema = v.object({
	tokenType: v.pipe(v.string(), v.nonEmpty()),
	userId: v.pipe(v.number(), v.integer()),
	lastChanged: v.pipe(v.string(), v.isoDateTimeSecond())
});
type GenericJWT = v.InferOutput<typeof genericJWTSchema>;

export function createJWT(
	user: typeof users.$inferSelect,
	tokenType: string = "loginToken",
	expirationTime: number | string | Date,
	additionalData?: Record<string, any>
) {
	return new SignJWT({
		tokenType,
		userId: user.id,
		lastChanged: user.updatedAt.toISOString(),
		...additionalData
	} as GenericJWT)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expirationTime)
		.sign(jwtSecretKey);
}

// Be aware! Overload hell here

export async function validateJWT(
	jwt: string,
	expectedTokenType?: string
): Promise<{
	user: typeof users.$inferSelect;
	data: GenericJWT;
} | null>;

export async function validateJWT<DataSchema extends v.ObjectSchema<any, any>>(
	jwt: string,
	expectedTokenType: string,
	additionalDataSchema: DataSchema
): Promise<{
	user: typeof users.$inferSelect;
	data: GenericJWT & v.InferOutput<DataSchema>;
} | null>;

export async function validateJWT(
	jwt: string,
	expectedTokenType = "loginToken",
	additionalDataSchema?: v.ObjectSchema<any, any>
) {
	const { payload } = await jwtVerify(jwt, jwtSecretKey);

	const results = v.safeParse(
		v.intersect([genericJWTSchema, additionalDataSchema ?? v.object({})]),
		payload
	);
	if (!results.success) return null;

	const data = results.output;
	if (data.tokenType !== expectedTokenType) return null;

	const user = await db.query.users.findFirst({ where: { id: data.userId } });
	if (user?.updatedAt.toISOString() !== data.lastChanged) return null;

	return { user, data };
}
