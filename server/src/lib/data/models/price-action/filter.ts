import day from "@shared/lib/datetime/day";
import { toTimestamp } from "@shared/lib/datetime/timestamp";
import type { Nullable } from "@shared/types/utility.types";
import type { Timestamp } from "@shared/types/zod.utility.types";
import type { Ticker } from "types/data.types";
import type { SQL } from "types/utility.types";

/** Ticker filter for price action queries.
 * @note do not put this as the first condition, since it returns "AND ...". */
export function sqlTickerFilter({
	sql,
	tickers,
}: {
	sql: SQL;
	tickers: Ticker[];
}) {
	return tickers.length > 0
		? sql`and ticker = ANY(${sql.array(tickers)})`
		: sql``;
}

type TimestampFilterArgs = {
	sql: SQL;
	from: Nullable<Timestamp>;
	to: Nullable<Timestamp>;
};
/** Timestamp filter (from, to) for price action queries.
 * @note do not put this as the first condition, since it returns "AND ...". */
export function sqlTimestampFilter({ sql, from, to }: TimestampFilterArgs) {
	if (!from && !to) return sql``;

	const _from = toTimestamp(from ?? 0);
	const _to = toTimestamp(to ?? Date.now());

	if (day(_to).isBefore(day(_from))) {
		throw new Error("to cannot be before from");
	}

	// TODO: ensure that `to` is after `from`

	return sql`
      AND timestamp >= ${_from} 
      AND timestamp <= ${_to}
   `;
}
