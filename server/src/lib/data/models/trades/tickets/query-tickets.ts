import { TRADES_TABLES } from "@shared/types/table.types";
import { query } from "@/lib/query-function";

export const queryTickets = query(
	async (sql, { ids, tickers }: { ids?: string[]; tickers?: string[] }) => {
		const idFilter = ids?.length
			? sql`where id = any(${ids})`
			: sql`where true`;
		const tickerFilter = tickers?.length
			? sql`and ticker = any(${tickers})`
			: sql`and true`;

		return await sql`
         select * from ${sql(TRADES_TABLES.tickets)}
         ${idFilter}
         ${tickerFilter}
      `;
	}
);
