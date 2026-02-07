import { ticketInputSchema } from "@shared/types/trades.input.types";
import { z } from "@shared/types/zod.utility.types";
import { createTickets } from "@/lib/data/models/trades/tickets/create-tickets";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const createTicketsMutation = publicProcedure
	.input(
		z.object({
			tickets: ticketInputSchema.array().min(1),
		})
	)
	.mutation(async ({ input }) => {
		return await createTickets(input);
	});
