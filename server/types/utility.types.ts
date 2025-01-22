import type { sqlConnection } from "@/db/init";

export type SQL = typeof sqlConnection;

type WithSQL<T> = T & { sql?: SQL };

/** Type helper for functions that interact with the database. */
export type QueryFunction<TInput, TOutput> = (args: WithSQL<TInput>) => Promise<TOutput>;

export type ObjectEntries<T> = [keyof T, T[keyof T]][];

export function typedObjectEntries<T extends object>(obj: T) {
	return Object.entries(obj) as ObjectEntries<T>;
}
