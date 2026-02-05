import { TRADES_TABLES } from "@shared/types/table.types";
import type { Ticket, Trade } from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

export const queryTickets = query(
	async (
		sql,
		{
			ids,
			tickers,
			trade_id,
		}: { ids?: string[]; tickers?: string[]; trade_id?: Trade["id"] }
	) => {
		const idFilter = ids?.length
			? sql`where id = any($\{ids})`
			: sql`where true`;
		const tickerFilter = tickers?.length
			? sql`and ticker = any(${tickers})`
			: sql`and true`;
		const tradeFilter = trade_id
			? sql`and trade_id = ${trade_id}`
			: sql`and true`;

		return await sql<Ticket[]>`
         select * from ${sql(TRADES_TABLES.tickets)}
         ${idFilter}
         ${tickerFilter}
         ${tradeFilter}
      `;
	}
);
