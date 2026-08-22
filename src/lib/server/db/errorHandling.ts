import { DrizzleQueryError } from "drizzle-orm";
import pg from "postgres";

export class DBConflictError extends Error {
	conflict;

	constructor(pgError: pg.PostgresError) {
		const conflict = /Key \((\w*)\)=\([^\)]*\) already exists\./.exec(pgError.detail!)![1];

		super(`Conflict on key "${conflict}" on table "${pgError.table_name}".`);

		this.conflict = conflict;
	}
}

export class DBError extends Error {
	constructor(pgError: pg.PostgresError) {
		super(pgError.message, { cause: pgError });
	}
}

const errorMap: Record<string, typeof DBError> = { "23505": DBConflictError };

export function handleDbError(e: unknown) {
	if (!(e instanceof DrizzleQueryError && e.cause instanceof pg.PostgresError)) throw e;
	const pgerror = e.cause;

	if (!(pgerror.code in errorMap)) {
		throw new Error(`DB encountered unknown PostgresError with code "${pgerror.code}"`, {
			cause: pgerror
		});
	}

	return new errorMap[pgerror.code](pgerror);
}
