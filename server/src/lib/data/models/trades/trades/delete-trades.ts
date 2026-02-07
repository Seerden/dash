import { TRADES_TABLES } from "@shared/types/table.types";
import type { Trade } from "@shared/types/trades.types";
import { createTransaction, query } from "@/lib/query-function";

/** Delete the given trades by id. */
export const deleteTrades = query(async ({ ids }: { ids: string[] }) => {
	if (!ids?.length) {
		return;
	}

	return await createTransaction(async (sql) => {
		const uniqueIds = Array.from(new Set(ids));
		const deletedTrades = await sql<Trade[]>`
         delete from ${sql(TRADES_TABLES.trades)}
         where id = any(${uniqueIds})
         returning *
      `;

		if (deletedTrades.length !== uniqueIds.length) {
			throw new Error(
				`deleteTrades: rolling back; could not delete all trades given ids ${ids}`
			);
		}

		return deletedTrades;
	});
});
