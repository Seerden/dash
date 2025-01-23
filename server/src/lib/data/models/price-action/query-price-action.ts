import { sqlConnection } from "@/db/init";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { Datelike } from "@shared/types/utility.types";
import type { Ticker } from "types/data.types";
import {
	priceActionWithUpdatedAtSchema,
	type PriceAction,
} from "types/price-action.types";
import type { QueryFunction, SQL } from "types/utility.types";

type QueryPriceActionFlatArgs = {
	limit?: number;
	tickers?: Ticker[];
	minVolume?: number;
	table?: `${PRICE_ACTION_TABLES}`;
	// everything below is not yet implemented
	from?: Datelike; // TODO: refine this type
	to?: Datelike; // TODO: refine this type
};

type QueryPriceActionGroupedArgs = QueryPriceActionFlatArgs & {
	groupBy: "ticker" | "timestamp"; // TODO: refine this type
};

/** Additional ticker filter for price action queries.
 * @note do not put this as the first condition, since it returns "AND ...". */
function sqlTickerFilter({ sql, tickers }: { sql: SQL; tickers: Ticker[] }) {
	return tickers.length > 0 ? sql`and ticker = ANY(${sql(tickers)})` : sql``;
}

function toTimestamp(timestamp: Datelike) {
	return new Date(timestamp).valueOf();
}

function sqlTimestampFilter({
	sql,
	from,
	to,
}: {
	sql: SQL;
	from?: Datelike;
	to?: Datelike;
}) {
	if (!from && !to) return sql``;

	const _from = toTimestamp(from ?? 0);
	const _to = toTimestamp(to ?? Date.now());

	// TODO: chekc if to is after from

	return sql`
      AND timestamp >= ${_from} 
      AND timestamp <= ${_to}
   `;
}

export const queryPriceActionFlat: QueryFunction<
	QueryPriceActionFlatArgs,
	PriceAction[]
> = async ({
	sql = sqlConnection,
	limit = 1e4, // 10_000 row limit by default to prevent accidentally fetching 100 million rows. 😀
	tickers = [],
	minVolume = 0,
	table = PRICE_ACTION_TABLES.DAILY,
	from,
	to,
}) => {
	const rows = await sql<PriceAction[]>`
      SELECT * FROM ${sql(table)}
      WHERE volume >= ${minVolume}
      ${sqlTickerFilter({ sql, tickers })}
      ${sqlTimestampFilter({ sql, from, to })}
      LIMIT ${limit};
   `;
	return rows.map((row) => priceActionWithUpdatedAtSchema.parse(row));
};

/** Query price action rows and group them by `timestamp` or `ticker`.
 * When grouping by timestamps, the returned keys (timestamps) will be integer
 * unix ms values. */
export const queryPriceActionGrouped: QueryFunction<
	QueryPriceActionGroupedArgs,
	Record<string, PriceAction[]>
> = async ({
	sql = sqlConnection,
	limit = 1e4, // 10_000 row limit by default to prevent accidentally fetching 100 million rows. 😀
	tickers = [],
	minVolume = 0,
	table = PRICE_ACTION_TABLES.DAILY,
	from,
	to,
	groupBy,
}) => {
	// query price_action_1d, and use json agg or something to group the rows by ticker
	const [result] = await sql<[{ price_action: Record<string, PriceAction[]> }]>`
      SELECT jsonb_object_agg(${sql(groupBy)}, price_actions) as price_action
      FROM (
         SELECT 
            ${
					groupBy === "timestamp"
						? sql`extract(epoch from ${sql(groupBy)}) * 1000 as timestamp`
						: sql`${sql(groupBy)}`
				}, 
            jsonb_agg(to_jsonb(price_action)) 
         AS price_actions
         FROM ${sql(table)} price_action
         WHERE volume >= ${minVolume}
         ${sqlTickerFilter({ sql, tickers })}
         ${sqlTimestampFilter({ sql, from, to })}
         GROUP BY ${sql(groupBy)}
         LIMIT ${limit}
      ) AS subquery;
   `;

	if (groupBy === "timestamp") {
		return Object.entries(result.price_action).reduce((acc, [key, value]) => {
			const mappedTimestamp = Number(key).toFixed(0);
			return { ...acc, [mappedTimestamp]: value };
		}, {});
	}

	return result.price_action;
};
