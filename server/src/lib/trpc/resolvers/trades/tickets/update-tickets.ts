import { ticketInputSchema } from "@shared/types/trades.types";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const updateTicketsMutation = publicProcedure
	// TODO: is ticketInputSchema correct, or do we only allow a subset of the
	// fields to be updatable?
	.input(ticketInputSchema)
	.mutation(async () => {
		return;
	});
