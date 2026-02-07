import { TRADES_TABLES } from "@shared/types/table.types";
import type { TicketInput } from "@shared/types/trades.input.types";
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

/** Given a list of tickets, insert the tickets into the database and
 * create/update the trades they belong to accordingly.
 * @note this may have unexpected behavior if trades are not supplied in
 * chronological order (brokers may not always provide detailed enough
 * timestamps, which means sorting tickets by ascending timestamps is
 * impossible and we just have to hope that the provided array is sorted
 * already).
 * @todo think about how to prevent duplicate tickets when using this function
 * instead of `createTradeWithTickets`
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
export const createTickets = query(
	async ({ tickets }: { tickets: TicketInput[] }) => {
		const byTicker = tickets.reduce((acc, ticket) => {
			acc.set(ticket.ticker, [...(acc.get(ticket.ticker) ?? []), ticket]);
			return acc;
		}, new Map<string, TicketInput[]>());

		await createTransaction(async () => {
			const insertedTickets: Ticket[] = [];

			for (const [ticker, ticketsByTicker] of byTicker.entries()) {
				const openTrades = await queryTrades({ open: true, tickers: [ticker] });
				if (openTrades.length > 1) {
					throw new Error(
						`createTickets: found multiple open trades for ticker ${ticker}`
					);
				}
				let currentTrade: Nullable<Trade> = openTrades?.[0];
				if (!currentTrade) {
					const account = ticketsByTicker[0].account;
					const tradeInput = buildTradeInput({
						ticker,
						account,
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
