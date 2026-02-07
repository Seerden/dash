import { TRADES_TABLES } from "@shared/types/table.types";
import type { TicketInput, TradeInput } from "@shared/types/trades.input.types";
import type { TicketInsert, Trade } from "@shared/types/trades.types";
import { insertTickets } from "@/lib/data/models/trades/tickets/create-tickets";
import { createTransaction, query } from "@/lib/query-function";

export const createTrades = query(
	async ({ trades }: { trades: TradeInput[] }) => {
		return await createTransaction(async (sql) => {
			const createdTrades = await sql<Trade[]>`
            insert into ${sql(TRADES_TABLES.trades)}
            ${sql(trades)}
            returning *
         `;

			if (createdTrades.length !== trades.length) {
				throw new Error(
					"createTrades: could not insert the expected number of trades into database"
				);
			}

			return createdTrades;
		});
	}
);

/** This creates a trade using the given tickets.
 * @note this _assumes_ (@todo verify) that the tickets make up exactly one
 * trade. I don't think we need to enforce the trade being _complete_, but we
 * _do_ assume that all the tickets belong to this trade, and that there were no
 * tickets earlier in time that also belong to this trade.
 * @example so the trade could subsist of [...tickets, <future tickets>] or just
 * [...tickets], but never [...past tickets, ...tickets] */
export const createTradeWithTickets = query(
	async ({ trade, tickets }: { trade: TradeInput; tickets: TicketInput[] }) => {
		// TODO: check if tickets are of the same type (long/short)
		const tickers = new Set(tickets.map((t) => t.ticker));
		if (tickers.size !== 1) {
			throw new Error(
				"createTradeWithTickets: tickets provided for more than 1 ticker"
			);
		}

		return await createTransaction(async (sql) => {
			const createdTrade = (await createTrades({ trades: [trade] }))[0];
			const ticketsToInsert: TicketInsert[] = tickets.map((t) => ({
				...t,
				trade_id: createdTrade.id,
			}));
			const createdTickets = await insertTickets({ tickets: ticketsToInsert });

			return {
				trade: createdTrade,
				tickets: createdTickets,
			};
		});
	}
);
