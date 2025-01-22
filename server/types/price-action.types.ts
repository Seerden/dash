import type { OHLCV } from "@/lib/polygon/polygon.types";
import { z } from "zod";

export const priceActionSchema = z.object({
	ticker: z.string(),
	timestamp: z.number(), // unix ms timestamp, or date, depending on whether we parse inside the query
	open: z.number(),
	close: z.number(),
	high: z.number(),
	low: z.number(),
	volume: z.number(),
});

export const priceActionWithUpdatedAtSchema = priceActionSchema.extend({
	updated_at: z.number(), // see timestamp
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
