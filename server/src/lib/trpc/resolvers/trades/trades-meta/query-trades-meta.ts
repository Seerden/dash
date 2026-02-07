import { queryTradesMetaSchema } from "@shared/types/trades.query.types";
import { queryTradesMeta } from "@/lib/data/models/trades/trades-meta/query-trades-meta";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const queryTradesMetaQuery = publicProcedure
	.input(queryTradesMetaSchema)
	.query(async ({ input }) => {
		return await queryTradesMeta(input);
	});
