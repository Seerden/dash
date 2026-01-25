import type { PriceActionWithUpdatedAt } from "@shared/types/price-action.types";
import {
	type PriceAction,
	priceActionWithUpdatedAtSchema,
} from "@shared/types/price-action.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { Nullable } from "@shared/types/utility.types";
import type {
	FlatPriceActionQuery,
	GroupedPriceActionQuery,
} from "types/price-action.types";
import type { QueryFunction } from "types/utility.types";
import { sqlConnection } from "@/db/init";
import {
	sqlTickerFilter,
	sqlTimestampFilter,
} from "@/lib/data/models/price-action/filter";

/** Queries price action rows from the database using the given constraints.
 * Does not group or parse the data in any way. */
export const queryPriceActionFlat: QueryFunction<
	FlatPriceActionQuery,
	PriceActionWithUpdatedAt[]
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
      ORDER BY ticker asc
      LIMIT ${limit}
   `;
	return rows.map((row) => priceActionWithUpdatedAtSchema.parse(row));
};

type QueryResult = [
	{ price_action: Record<string, PriceActionWithUpdatedAt[]> }?,
];

/** Query price action rows and group them by `timestamp` or `ticker`.
 * When grouping by timestamps, the returned keys (timestamps) will be integer
 * unix ms values. */
export const queryPriceActionGrouped: QueryFunction<
	GroupedPriceActionQuery,
	Nullable<Map<string, PriceActionWithUpdatedAt[]>>
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
	const [result] =
		await sql<QueryResult>`SELECT jsonb_object_agg(${sql(groupBy)}, price_actions) as price_action
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

	if (!result?.price_action) {
		return null;
	}

	if (groupBy === "timestamp") {
		const hashObject = Object.entries(result.price_action).reduce(
			(acc, [key, value]) => {
				const mappedTimestamp = Number(key).toFixed(0);
				return { ...acc, [mappedTimestamp]: value };
			},
			{}
		);
		return new Map(Object.entries(hashObject));
	}

	return new Map(Object.entries(result.price_action));
};

/** Queries the unique timestamps (as unix milliseconds) from a price action table. */
export const queryTimestamps: QueryFunction<
	{ table?: `${PRICE_ACTION_TABLES}` },
	{ unix: number }[]
> = async ({ sql = sqlConnection, table = PRICE_ACTION_TABLES.DAILY }) => {
	const rows = await sql<{ unix: Date }[]>`
      SELECT DISTINCT timestamp as unix FROM ${sql(table)}
   `;
	return rows.map((row) => ({ unix: row.unix.valueOf() }));
};
