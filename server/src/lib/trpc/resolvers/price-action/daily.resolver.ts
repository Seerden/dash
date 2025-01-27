import {
	queryPriceActionFlat,
	queryPriceActionGrouped,
} from "@/lib/data/models/price-action/query-price-action";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { priceActionWithUpdatedAtSchema } from "@shared/types/price-action.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import { datelike } from "@shared/types/zod.utility.types";
import { z } from "zod";

/*
   If we want to refine the typing to make "from", "to", or "both" required, we can
   use something like this:
      const schema = z.object({
      email: z.string().optional(),
      username: z.string().optional(),
      // other properties here
      })
      .and(z.union([
      z.object({email: z.undefined(), username: z.string()}),
      z.object({email: z.string(), username: z.undefined()}),
      z.object({email: z.string(), username: z.string()}),
      ], {errorMap: (issue, ctx) => ({message: "Either email or username must be
      filled in"})}));
      which I found in this discussion:
      https://github.com/colinhacks/zod/issues/61#issuecomment-1534255967 

*/

/** Validator that matches QueryPriceActionFlatArgs | QueryPriceActionGroupedArgs
 * The difference being that "from" and "to" are both required. I might change
 * my mind on this. */
export const flatPriceActionQuerySchema = z.object({
	limit: z.number().optional().default(1e4),
	tickers: z.array(z.string()).optional(),
	minVolume: z.number().optional().default(0),
	table: z.nativeEnum(PRICE_ACTION_TABLES),
	from: datelike,
	to: datelike,
});
export type FlatPriceActionQuery = z.infer<typeof flatPriceActionQuerySchema>;

export const groupedPriceActionQuerySchema = flatPriceActionQuerySchema.extend({
	groupBy: z.union([z.literal("ticker"), z.literal("timestamp")]),
});
export type GroupedPriceActionQuery = z.infer<typeof groupedPriceActionQuerySchema>;

export const flatDailyPriceActionResolver = publicProcedure
	.input(flatPriceActionQuerySchema)
	.output(z.array(priceActionWithUpdatedAtSchema))
	.query(async (opts) => {
		return await queryPriceActionFlat({
			...opts.input,
		});
	});

export const groupedDailyPriceActionResolver = publicProcedure
	.input(groupedPriceActionQuerySchema)
	.output(z.record(z.string(), z.array(priceActionWithUpdatedAtSchema)).nullable())
	.query(async (opts) => {
		return await queryPriceActionGrouped({
			...opts.input,
			groupBy: opts.input.groupBy,
		});
	});
