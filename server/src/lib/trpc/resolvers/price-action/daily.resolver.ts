import {
	queryPriceActionFlat,
	queryPriceActionGrouped,
} from "@/lib/data/models/price-action/query-price-action";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { priceActionWithUpdatedAtSchema } from "@shared/types/price-action.types";
import {
	flatPriceActionQuerySchema,
	groupedPriceActionQuerySchema,
} from "types/price-action.types";
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
	.output(z.map(z.string(), z.array(priceActionWithUpdatedAtSchema)).nullable())
	.query(async (opts) => {
		return await queryPriceActionGrouped({
			...opts.input,
			groupBy: opts.input.groupBy,
		});
	});
