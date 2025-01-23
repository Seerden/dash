import type { OHLCV } from "@/lib/polygon/polygon.types";
import { datelike, numeric } from "@shared/types/zod.utility.types";
import { z } from "zod";

export const priceActionSchema = z.object({
	ticker: z.string(),
	timestamp: datelike, // unix ms timestamp, or date, depending on whether we parse inside the query
	open: numeric(6),
	close: numeric(6),
	high: numeric(6),
	low: numeric(6),
	volume: numeric(2),
});

export const priceActionWithUpdatedAtSchema = priceActionSchema.extend({
	updated_at: datelike, // same note as with `timestamp` in `priceActionSchema`
});

export type PriceAction = z.infer<typeof priceActionSchema>;
export type PriceActionWithUpdatedAt = z.infer<typeof priceActionWithUpdatedAtSchema>;

const polygonToPriceAction = {
	ticker: "T",
	timestamp: "t",
	open: "o",
	close: "c",
	high: "h",
	low: "l",
	volume: "v",
} as Record<keyof PriceAction, keyof OHLCV>;

export const polygonPriceActionMap = new Map<keyof PriceAction, keyof OHLCV>(
	Object.entries(polygonToPriceAction) as [keyof PriceAction, keyof OHLCV][],
);
