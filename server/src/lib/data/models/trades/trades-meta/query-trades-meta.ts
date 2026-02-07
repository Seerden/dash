import { TRADES_TABLES } from "@shared/types/table.types";
import type { QueryTradesMeta } from "@shared/types/trades.query.types";
import type { TradeMeta } from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

// TODO: implement specific filters, like trade_ids, tickers; have to map them
// by those things, which increases the complexity, and I can't be bothered
// right now.
export const queryTradesMeta = query(async (sql, { ids }: QueryTradesMeta) => {
	return await sql<TradeMeta[]>`
      select * from ${sql(TRADES_TABLES.meta)}
      where id = any(${sql(ids)})
   `;
});
