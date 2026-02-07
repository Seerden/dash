import { z } from "@shared/types/zod.utility.types";
import { deleteTrades } from "@/lib/data/models/trades/trades/delete-trades";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const deleteTradesMutation = publicProcedure
	.input(
		z.object({
			ids: z.string().array(),
		})
	)
	.mutation(async ({ input }) => {
		return await deleteTrades(input);
	});
