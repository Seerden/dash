import { createTicketsMutation } from "@/lib/trpc/resolvers/trades/tickets/create-tickets";
import { deleteTicketsMutation } from "@/lib/trpc/resolvers/trades/tickets/delete-tickets";
import { updateTicketsMutation } from "@/lib/trpc/resolvers/trades/tickets/update-tickets";
import { t } from "@/lib/trpc/trpc-context";

export const tradesRouter = t.router({
	tickets: {
		create: createTicketsMutation,
		delete: deleteTicketsMutation,
		update: updateTicketsMutation,
	},
});
