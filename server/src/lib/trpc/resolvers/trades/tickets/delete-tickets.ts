import { z } from "@shared/types/zod.utility.types";
import { deleteTickets } from "@/lib/data/models/trades/tickets/delete-tickets";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const deleteTicketsMutation = publicProcedure
	.input(
		z.object({
			ids: z.string().array(),
		})
	)
	.mutation(async ({ input }) => {
		return await deleteTickets(input);
	});
