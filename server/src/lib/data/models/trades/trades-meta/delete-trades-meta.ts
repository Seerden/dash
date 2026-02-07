import { TRADES_TABLES } from "@shared/types/table.types";
import type { TradeMeta } from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

/** Delete the given trades meta rows by id. */
export const deleteTradesMeta = query(
	async (sql, { ids }: { ids: string[] }) => {
		return await sql<TradeMeta[]>`
         delete from ${TRADES_TABLES.meta}
         where id = any(${sql(ids)})
         returning *
      `;
	}
);
