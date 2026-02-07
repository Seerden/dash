import { queryTradesSchema } from "@shared/types/trades.query.types";
import { queryTrades } from "@/lib/data/models/trades/trades/query-trades";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const queryTradesQuery = publicProcedure
	.input(queryTradesSchema)
	.query(async ({ input }) => {
		return await queryTrades(input);
	});
