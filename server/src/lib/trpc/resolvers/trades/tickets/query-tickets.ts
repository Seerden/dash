import { queryTicketsSchema } from "@shared/types/trades.query.types";
import { queryTickets } from "@/lib/data/models/trades/tickets/query-tickets";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const queryTicketsQuery = publicProcedure
	.input(queryTicketsSchema)
	.mutation(async ({ input }) => {
		return await queryTickets(input);
	});
