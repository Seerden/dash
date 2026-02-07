import { createTicketsMutation } from "@/lib/trpc/resolvers/trades/tickets/create-tickets";
import { deleteTicketsMutation } from "@/lib/trpc/resolvers/trades/tickets/delete-tickets";
import { queryTicketsQuery } from "@/lib/trpc/resolvers/trades/tickets/query-tickets";
import { updateTicketsMutation } from "@/lib/trpc/resolvers/trades/tickets/update-tickets";
import { createTradesMutation } from "@/lib/trpc/resolvers/trades/trades/create-trades";
import { deleteTradesMutation } from "@/lib/trpc/resolvers/trades/trades/delete-trades";
import { queryTradesQuery } from "@/lib/trpc/resolvers/trades/trades/query-trades";
import { updateTradesMutation } from "@/lib/trpc/resolvers/trades/trades/update-trades";
import { createTradesMetaMutation } from "@/lib/trpc/resolvers/trades/trades-meta/create-trades-meta";
import { deleteTradesMetaMutation } from "@/lib/trpc/resolvers/trades/trades-meta/delete-trades-meta";
import { queryTradesMetaQuery } from "@/lib/trpc/resolvers/trades/trades-meta/query-trades-meta";
import { updateTradesMetaMutation } from "@/lib/trpc/resolvers/trades/trades-meta/update-trades-meta";
import { t } from "@/lib/trpc/trpc-context";

export const tradesRouter = t.router({
	tickets: {
		create: createTicketsMutation,
		delete: deleteTicketsMutation,
		update: updateTicketsMutation,
		query: queryTicketsQuery,
	},
	trades: {
		create: createTradesMutation,
		delete: deleteTradesMutation,
		update: updateTradesMutation,
		query: queryTradesQuery,
	},
	tradesMeta: {
		create: createTradesMetaMutation,
		delete: deleteTradesMetaMutation,
		update: updateTradesMetaMutation,
		query: queryTradesMetaQuery,
	},
});
