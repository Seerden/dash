import type { PriceAction } from "@shared/types/price-action.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import { timestampSchema, z } from "@shared/types/zod.utility.types";
import type { OHLCV } from "@/lib/polygon/polygon.types";

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
	Object.entries(polygonToPriceAction) as [keyof PriceAction, keyof OHLCV][]
);

const dateRangeSchema = z.object({
	from: timestampSchema.nullable(),
	to: timestampSchema.nullable(),
});
// .superRefine(({ from, to }, ctx) => {
// 	if (from && to && day(from).isAfter(day(to))) {
// 		ctx.addIssue({
// 			code: z.ZodIssueCode.custom,
// 			message: "from cannot be after to",
// 			path: ["from"],
// 		});
// 	}
// });

/**
 * @todo the actual database query considers from and to optional, but this
 * consider them both required. See note in daily.resolver.ts on this.
 */
export const flatPriceActionQuerySchema = z
	.object({
		limit: z.optional(z.number().default(1e4)),
		tickers: z.optional(z.array(z.string())),
		minVolume: z.optional(z.number().default(0)),
		table: z.optional(z.nativeEnum(PRICE_ACTION_TABLES)),
	})
	.and(dateRangeSchema);
export type FlatPriceActionQuery = z.infer<typeof flatPriceActionQuerySchema>;

export const groupedPriceActionQuerySchema = flatPriceActionQuerySchema.and(
	z.object({
		groupBy: z.union([z.literal("ticker"), z.literal("timestamp")]),
	})
);
export type GroupedPriceActionQuery = z.infer<
	typeof groupedPriceActionQuerySchema
>;
