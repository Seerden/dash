import { updateTradeInputSchema } from "@shared/types/trades.input.types";
import { z } from "@shared/types/zod.utility.types";
import { updateTrades } from "@/lib/data/models/trades/trades/update-trades";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const updateTradesMutation = publicProcedure
	.input(
		z.object({
			trades: updateTradeInputSchema.array().min(1),
		})
	)
	.mutation(async ({ input }) => {
		return await updateTrades(input);
	});
