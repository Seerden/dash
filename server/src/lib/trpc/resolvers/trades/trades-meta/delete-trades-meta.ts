import { z } from "@shared/types/zod.utility.types";
import { deleteTradesMeta } from "@/lib/data/models/trades/trades-meta/delete-trades-meta";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const deleteTradesMetaMutation = publicProcedure
	.input(
		z.object({
			ids: z.string().array(),
		})
	)
	.mutation(async ({ input }) => {
		return await deleteTradesMeta(input);
	});
