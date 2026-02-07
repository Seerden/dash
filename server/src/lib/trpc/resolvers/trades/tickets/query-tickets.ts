import { queryTicketsSchema } from "@shared/types/trades.query.types";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const queryTicketsQuery = publicProcedure
	.input(queryTicketsSchema)
	.mutation(async () => {
		return;
	});
