import { TRADES_TABLES } from "@shared/types/table.types";
import type { Trade, TradeInput } from "@shared/types/trades.types";
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
