import type { OHLCV } from "@/lib/polygon/polygon.types";
import type { PriceAction } from "@shared/types/price-action.types";

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
