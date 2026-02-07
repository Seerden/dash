import { TRADES_TABLES } from "@shared/types/table.types";
import type { TicketInput, TradeInput } from "@shared/types/trades.input.types";
import type { Ticket, TicketInsert, Trade } from "@shared/types/trades.types";
import type { Nullable } from "@shared/types/utility.types";
import { queryTickets } from "@/lib/data/models/trades/tickets/query-tickets";
import {
	buildTradeInput,
	createTicket,
} from "@/lib/data/models/trades/tickets/ticket.utilities";
import { createTrades } from "@/lib/data/models/trades/trades/create-trades";
import { queryTrades } from "@/lib/data/models/trades/trades/query-trades";
import { createTransaction, query } from "@/lib/query-function";

// TODO: use TicketInsert type and make this take an array of tickets.
export const insertTickets = query(
	async ({ tickets }: { tickets: TicketInsert[] }) => {
		return await createTransaction(async (sql) => {
			const response = await sql<[Ticket]>`
            insert into ${sql(TRADES_TABLES.tickets)}
            ${sql(tickets)}
            returning *
         `;

			if (response.length !== tickets.length) {
				throw new Error("insertTickets: did not insert every ticket");
			}

			return response;
		});
	}
);

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
		 */

		const byTicker = tickets.reduce((acc, ticket) => {
			acc.set(ticket.ticker, [...(acc.get(ticket.ticker) ?? []), ticket]);
			return acc;
		}, new Map<string, TicketInput[]>());

		await createTransaction(async (sql) => {
			const insertedTickets: Ticket[] = [];

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
				let currentTrade: Nullable<Trade> = openTrades?.[0];
				if (!currentTrade) {
					const tradeInput: TradeInput = buildTradeInput({
						ticker,
						account: ticketsByTicker[0].account,
					});
					currentTrade = (await createTrades({ trades: [tradeInput] }))[0];
				}

				let currentTickets: Ticket[] = await queryTickets({
					trade_id: currentTrade.id,
				});

				// biome-ignore lint/correctness/noConstantCondition: see TODO v
				if (false) {
					// TODO: get the latest ticket for this ticker to see if we can "naively"
					// add the ticket (see [1] above) and set this if-loop's
					// condition accordingly. For now, just proceed as if [1] holds.
				}

				for (const ticket of ticketsByTicker) {
					const { insertedTicket, nextTickets, nextTrade } = await createTicket(
						{
							ticket,
							currentTickets,
							currentTrade,
						}
					);
					currentTickets = nextTickets;
					currentTrade = nextTrade;
					insertedTickets.push(insertedTicket);
				}
			}

			if (insertedTickets.length !== tickets.length) {
				throw new Error("createTickets: did not insert all tickets");
			}
		});
	}
);
