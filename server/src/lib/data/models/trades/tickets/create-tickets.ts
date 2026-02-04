import type { TicketInput, TradeInput } from "@shared/types/trades.types";
import { createTrades } from "@/lib/data/models/trades/trades/create-trades";
import { queryTrades } from "@/lib/data/models/trades/trades/query-trades";
import { createTransaction, query } from "@/lib/query-function";

export const createTickets = query(
	async ({ tickets }: { tickets: TicketInput[] }) => {
		/**
		 * TODO: how do we handle the prevention of duplicate tickets?
		 * TODO: we have to associate tickets with trades.
		 * - the difficult thing is: tickets can be added with _any timestamp_, so we
		 *   might have to reconstruct the entire sequence of trades, and tickets may be
		 *   shifted to another trade.
		 * I think we can split this up into two cases [1]:
		 *    - if the ticket input has a timestamp after the other latest trade, we either
		 *   append to the existing trade, or create a new one
		 *    - if the timestamp is before the previous latest trade, we have to rebuild
		 *      the whole sequence of tickets and trades. I will handle this in the future.
		 *       - a stopgap would be to do something like a createTradeWithTickets()
		 *         function that takes the _whole_ set of tickets for that trade and
		 *         creates a new trade with those tickets, regardless of whether that
		 *         trade happened before an already existing trade.
		 * -
		 */

		const byTicker = tickets.reduce((acc, ticket) => {
			acc.set(ticket.ticker, [...(acc.get(ticket.ticker) ?? []), ticket]);
			return acc;
		}, new Map<string, TicketInput[]>());

		await createTransaction(async (sql) => {
			for (const [ticker, ticketsByTicker] of byTicker.entries()) {
				// get the latest open trade and its tickets;
				// let currentTrade = await queryTrades({open: true, ticker})
				//    - if there is no trade yet, create one
				const openTrades = await queryTrades({ open: true, tickers: [ticker] });
				if (openTrades.length > 1) {
					throw new Error(
						`createTickets: found multiple open trades for ticker ${ticker}`
					);
				}
				let currentTrade = openTrades?.[0];
				if (!currentTrade) {
					const tradeInput: TradeInput = {
						account: ticketsByTicker[0].account,
						ticker,
						realized: 0,
						unrealized: null,
						duration: null,
						closed: false,
					};
					currentTrade = (await createTrades({ trades: [tradeInput] }))[0];
				}

				// get the latest ticket for this ticker to see if we can "naively"
				// add the ticket (see [1] above)
				for (const ticket of ticketsByTicker) {
					// loop through tickets:
					// - if belongs to this trade, add it to this trade and update
					//   the trade details (realized etc.).
					//    - check if trade is now closed.
					//    - if yes:
					//       - update the trade
					//       - create a new trade and set it to currentTrade
				}
			}
		});
	}
);
