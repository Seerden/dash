import { tradeInputSchema } from "@shared/types/trades.input.types";
import { z } from "@shared/types/zod.utility.types";
import { createTrades } from "@/lib/data/models/trades/trades/create-trades";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const createTradesMutation = publicProcedure
	.input(
		z.object({
			trades: tradeInputSchema.array().min(1),
		})
	)
	.mutation(async ({ input }) => {
		return await createTrades(input);
	});
