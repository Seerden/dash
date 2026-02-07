import { updateTicketInputSchema } from "@shared/types/trades.input.types";
import { z } from "@shared/types/zod.utility.types";
import { updateTickets } from "@/lib/data/models/trades/tickets/update-tickets";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const updateTicketsMutation = publicProcedure
	.input(z.object({ tickets: updateTicketInputSchema.array().min(1) }))
	.mutation(async ({ input }) => {
		return await updateTickets(input);
	});
