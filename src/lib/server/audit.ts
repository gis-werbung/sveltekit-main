import type { InferInsertModel } from "drizzle-orm";
import { db, auditLog } from "./db";
import { getIdentBundle, getIdentText, type IdentBundle } from "./identification";

export async function insertAudit(
	values: InferInsertModel<typeof auditLog>,
	identBundle?: IdentBundle
) {
	if (!identBundle) identBundle = await getIdentBundle();
	const identText = getIdentText(identBundle);

	if (values.description) {
		values.description += "\n" + identText;
	} else {
		values.description = identText;
	}

	await db.insert(auditLog).values(values);
}
