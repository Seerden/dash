import { updateTradeMetaInputSchema } from "@shared/types/trades.input.types";
import { z } from "@shared/types/zod.utility.types";
import { updateTradesMeta } from "@/lib/data/models/trades/trades-meta/update-trades.meta";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const updateTradesMetaMutation = publicProcedure
	.input(z.object({ tradeMeta: updateTradeMetaInputSchema.array().min(1) }))
	.mutation(async ({ input }) => {
		return await updateTradesMeta(input);
	});
