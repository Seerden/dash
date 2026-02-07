import { TRADES_TABLES } from "@shared/types/table.types";
import type { QueryTrades } from "@shared/types/trades.query.types";
import type { Trade } from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

export const queryTrades = query(
	async (sql, { tickers, ids, open }: QueryTrades) => {
		const idFilter = ids?.length
			? sql`where id = any(${ids})`
			: sql`where true`;
		const tickerFilter = tickers?.length
			? sql`and ticker = any(${tickers})`
			: sql`and true`;
		const openFilter = open ? sql`and not 'open' = true` : sql`and true`;

		return await sql<Trade[]>`
         select * from ${sql(TRADES_TABLES.trades)}
         ${idFilter}
         ${tickerFilter}
         ${openFilter} 
      `;
	}
);
