import { tradeMetaInputSchema } from "@shared/types/trades.input.types";
import { z } from "@shared/types/zod.utility.types";
import { createTradesMeta } from "@/lib/data/models/trades/trades-meta/create-trades-meta";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const createTradesMetaMutation = publicProcedure
	.input(
		z.object({
			tradeMeta: tradeMetaInputSchema.array().min(1),
		})
	)
	.mutation(async ({ input }) => {
		return await createTradesMeta(input);
	});
