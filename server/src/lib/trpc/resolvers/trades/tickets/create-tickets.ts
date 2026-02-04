import { ticketInputSchema } from "@shared/types/trades.types";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const createTicketsMutation = publicProcedure
	.input(ticketInputSchema.array().min(1))
	.mutation(async () => {
		return;
	});
