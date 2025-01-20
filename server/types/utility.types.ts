import type { sqlConnection } from "@/db/init";

export type SQL = typeof sqlConnection;

type WithSQL<T> = T & { sql?: SQL };

/** Type helper for functions that interact with the database. */
export type QueryFunction<TInput, TOutput> = (args: WithSQL<TInput>) => Promise<TOutput>;
