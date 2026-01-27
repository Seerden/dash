import { AsyncLocalStorage } from "node:async_hooks";
import type { TransactionSql } from "postgres";
import { sqlConnection } from "@/db/init";

type Connection = typeof sqlConnection | TransactionSql;

const sqlStore = new AsyncLocalStorage<Connection>();

/** Gets the current SQL connection (transaction or default). */
export const getConnectionFromAsyncStore = (): Connection =>
	sqlStore.getStore() ?? sqlConnection;

/** Runs a function within a transaction context.
 * @todo (TRK-290) this is the new way to run transactions, instead of passing
 * sql as an argument to every single query function, which I thought was too
 * much boilerplate.
 * @usage
 * ```
 *    await sql.begin(async (q) => {
 *       await transaction(q, async () => {
 *          <inner logic here>
 *       })
 *    })
 * ```
 * @note for transactions, the sql connection's type becomes TransactionSql,
 * which has a .savepoint, but the query function might not be aware it's in a
 * transaction, so we need to either expand the store with this information, or
 * type-alias the connection manually in query functions when in a transaction.
 */
export const transaction = <T>(
	transactionSql: TransactionSql,
	queryFunction: () => Promise<T>
) => sqlStore.run(transactionSql, queryFunction);

type QueryFunction = {
	/**
	 * Overload 1: For functions that take (sql, input)
	 */
	<TInput, TOutput>(
		queryFunction: (sql: Connection, input: TInput) => Promise<TOutput>
	): (input?: TInput) => Promise<TOutput>;

	/**
	 * Overload 2: For functions that only take (input)
	 */
	<TInput, TOutput>(
		queryFunction: (input: TInput) => Promise<TOutput>
	): (input: TInput) => Promise<TOutput>;
};

/** Query function constructor.
 * This exists for the following purpose: If the inner function (e.g.
 * queryUsersById) doesn't need to use a non-standard sql connection (e.g. we're not in a
 * transaction), then we don't have to pass a sql connection manually.
 */
export const query: QueryFunction = <TInput, TOutput>(
	queryFunction:
		| ((sql: Connection, input: TInput) => Promise<TOutput>)
		| ((input: TInput) => Promise<TOutput>)
) => {
	return (input: TInput): Promise<TOutput> => {
		if (queryFunction.length === 2) {
			const sql = getConnectionFromAsyncStore();
			return (
				queryFunction as (sql: Connection, input: TInput) => Promise<TOutput>
			)(sql, input);
		} else {
			return (queryFunction as (input: TInput) => Promise<TOutput>)(input);
		}
	};
};

/** Small wrapper around `transaction` that calls sql.begin, runs and returns
 * the transaction.
 * @usage only use this inside query() inner functions. */
export const createTransaction = <T>(
	transactionQuery: (sql: TransactionSql) => Promise<T>
) => {
	const sql = getConnectionFromAsyncStore();
	// NOTE (DAS-55) we're using postgres 3.4.8 (c.f. other projects where I'm
	// still on 3.4.7), where the type of TransactionSql was fixed somewhat,
	// hence we now have to assume, here, that we're not in a transaction in
	// order for the typing to work out.
	return (sql as typeof sqlConnection).begin(async (q) => {
		return await transaction(q, () => transactionQuery(q));
	});
};
