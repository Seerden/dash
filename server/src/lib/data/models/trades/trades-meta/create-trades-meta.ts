import { TRADES_TABLES } from "@shared/types/table.types";
import type { TradeMetaInput } from "@shared/types/trades.input.types";
import { query } from "@/lib/query-function";

export const createTradesMeta = query(
	async (sql, { tradeMeta }: { tradeMeta: TradeMetaInput[] }) => {
		return await sql<TradeMetaInput[]>`
         insert into ${TRADES_TABLES.meta}
         ${sql(tradeMeta)}
      `;
	}
);
