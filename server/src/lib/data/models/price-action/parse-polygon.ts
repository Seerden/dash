import type { fetchAggregate } from "@/lib/polygon/endpoints/aggregate";
import type { fetchGroupedDaily } from "@/lib/polygon/endpoints/grouped-daily";
import type { OHLCV } from "@/lib/polygon/polygon.types";
import type { PriceAction } from "@shared/types/price-action.types";
import { typedObjectEntries } from "types/utility.types";

type Aggregate = Awaited<ReturnType<typeof fetchAggregate>>;

/** TODO: there's no point in implementing this until we've set up smaller
 * timescale tables and functionality, because aggregating daily data doesn't
 * make any sense for us.
 * @deprecated we're using historical data from the bucket for now, instead of
 * the API. */
export function parseAggregateToPriceAction(aggregate: Aggregate): PriceAction[] {
	throw new Error("Not implemented");
}

type GroupedDaily = Awaited<ReturnType<typeof fetchGroupedDaily>>;

/** Key-value map that matches polygon response fields to `PriceAction` fields */
export const mapPolygonToPriceAction: Record<keyof OHLCV, keyof PriceAction> = {
	T: "ticker",
	t: "timestamp",
	o: "open",
	h: "high",
	l: "low",
	c: "close",
	v: "volume",
};

export const mapPriceActionToPolygon = typedObjectEntries(mapPolygonToPriceAction).reduce(
	(acc, [key, value]) => ({ ...acc, [value]: key }),
	{} as Record<keyof PriceAction, keyof OHLCV>,
);

/** Parses the response from the grouped daily endpoint to price action objects,
 * which can then be inserted into the database.
 * @deprecated we're using historical data from the bucket for now, instead of
 * the API. */
export function parseGroupedDailyToPriceAction(
	groupedDaily: GroupedDaily,
): PriceAction[] {
	return groupedDaily.results.map(({ T, o, c, h, l, t, v }) => {
		const priceAction: PriceAction = {
			ticker: T,
			open: o,
			close: c,
			high: h,
			low: l,
			volume: v,
			timestamp: t,
		};

		return priceAction;
	});
}
