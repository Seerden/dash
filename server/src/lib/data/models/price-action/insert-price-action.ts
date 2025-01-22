import { sqlConnection } from "@/db/init";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { PriceAction, PriceActionWithUpdatedAt } from "types/price-action.types";
import { type QueryFunction } from "types/utility.types";

export const insertPriceAction: QueryFunction<
	{ priceAction: PriceAction[] },
	PriceActionWithUpdatedAt[]
> = async ({ sql = sqlConnection, priceAction }) => {
	// const map = priceAction.reduce((acc, cur) => {
	// 	for (const [key, value] of typedObjectEntries<PriceAction>(cur)) {
	// 		acc.set(key, [...(acc.get(key) ?? []), value]);
	// 	}
	// 	return acc;
	// }, new Map<keyof PriceAction, PriceAction[keyof PriceAction][]>());

	// const timestamps = map
	// 	.get("timestamp")
	// 	?.map((timestamp: number) => Math.round(timestamp / 1000));
	// const tickers = map.get("ticker");
	// const open = map.get("open");
	// const high = map.get("high");
	// const low = map.get("low");
	// const close = map.get("close");
	// const volume = map.get("volume");

	// if (!timestamps || !tickers || !open || !high || !low || !close || !volume) {
	// 	throw new Error("Missing required fields in price action");
	// }

	// This unnesting stuff is a bit verbose, but it should be quite a bit
	// faster than a regular insert. Casting the timestamps to numeric is
	// necessary because to_timestamp doesn't work with arrays.
	// const rows = await sql<[PriceActionWithUpdatedAt]>`
	//    INSERT INTO ${sql(PRICE_ACTION_TABLES.DAILY)} (ticker, timestamp, open, high, low, close, volume)
	//    SELECT * from unnest(
	//       ${sql.array(tickers)},
	//       ARRAY(
	//          SELECT to_timestamp(e) FROM unnest(${sql.array(timestamps)}::numeric[]) AS e
	//       ),
	//       ${sql.array(open)}::numeric[],
	//       ${sql.array(high)}::numeric[],
	//       ${sql.array(low)}::numeric[],
	//       ${sql.array(close)}::numeric[],
	//       ${sql.array(volume)}::numeric[]
	//    )
	//    ON CONFLICT (ticker, timestamp) DO NOTHING
	//    RETURNING *
	// `;

	// split priceAction into sets of 9000 (~7 fields * 9000 is approx 2**16,
	// wihichs the max parameter limit)
	const size = 9250;
	const setCount = Math.ceil(priceAction.length / size);
	// make a promise for each set
	const promises = Array.from({ length: setCount }).map(async (_, i) => {
		const rows = insertPriceActionSet({
			sql,
			priceAction: priceAction.slice(i * size, (i + 1) * size),
		});
		return rows;
	});

	return (await Promise.all(promises)).flat();
};

const insertPriceActionSet: QueryFunction<
	{ priceAction: PriceAction[] },
	PriceActionWithUpdatedAt[]
> = async ({ sql = sqlConnection, priceAction }) => {
	return sql<[PriceActionWithUpdatedAt]>`
      INSERT INTO ${sql(PRICE_ACTION_TABLES.DAILY)} ${sql(priceAction)}
      ON CONFLICT (ticker, timestamp) DO NOTHING
      RETURNING *
   `;
};
