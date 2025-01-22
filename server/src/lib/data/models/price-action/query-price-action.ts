import { sqlConnection } from "@/db/init";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { Datelike } from "@shared/types/utility.types";
import type { Ticker } from "types/data.types";
import type { PriceAction } from "types/price-action.types";
import type { QueryFunction } from "types/utility.types";

type PriceActionQueryArgs = {
	limit?: number;
	tickers?: Ticker[];
	minVolume?: number;
	table?: `${PRICE_ACTION_TABLES}`;
	// everything below is not yet implemented
	from?: Datelike; // TODO: refine this type
	to?: Datelike; // TODO: refine this type
	groupBy?: "ticker" | "timestamp"; // TODO: refine this type
};

export const queryPriceAction: QueryFunction<
	PriceActionQueryArgs,
	PriceAction[] | Record<string, PriceAction[]>
> = async ({
	sql = sqlConnection,
	limit = 1e4, // 10_000 row limit by default to prevent accidentally fetching 100 million rows. 😀
	tickers = [],
	minVolume = 0,
	table = PRICE_ACTION_TABLES.DAILY,
	groupBy,
}) => {
	const tickerFilter =
		tickers.length > 0 ? sql`and ticker = ANY(${sql(tickers)})` : sql``;

	if (groupBy) {
		const [groupedPriceAction] = await sql<[Record<string, PriceAction[]>]>`
         SELECT json_object_agg(${groupBy}, data)
         FROM (
            SELECT json_agg(row_to_json(${sql(table)}) as data
            FROM ${sql(table)} as ${table}
            WHERE volume >= ${minVolume}
            ${tickerFilter}
            LIMIT ${limit}
            GROUP BY ${groupBy}
         ) as ${groupBy}
      `;

		return groupedPriceAction;
	} else {
		const priceAction = await sql<PriceAction[]>`
         SELECT * FROM ${sql(table)}
         WHERE volume >= ${minVolume}
         ${tickerFilter}
         LIMIT ${limit};
      `;

		return priceAction;
	}
};
