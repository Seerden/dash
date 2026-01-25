import { datelike, numeric, z } from "./zod.utility.types";

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
export type PriceActionWithUpdatedAt = z.infer<
	typeof priceActionWithUpdatedAtSchema
>;
