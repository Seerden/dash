import { TRADES_TABLES } from "@shared/types/table.types";
import {
	type UpdateTradeInput,
	updateTradeInputSchema,
	updateTradeInsertSchema,
} from "@shared/types/trades.input.types";
import type { Trade } from "@shared/types/trades.types";
import { createTransaction, query } from "@/lib/query-function";

/** Update the given trades with the given values. */
export const updateTrades = query(
	async ({ trades }: { trades: UpdateTradeInput[] }) => {
		const parsedInput = updateTradeInputSchema.array().min(1).safeParse(trades);
		if (!parsedInput.success) {
			throw parsedInput.error;
		}

		const parseUpdateInputs = updateTradeInsertSchema
			.array()
			.min(1)
			.safeParse(
				parsedInput.data.map((d) => ({ ...d, updated_at: new Date() }))
			);

		if (!parseUpdateInputs.success) {
			throw parseUpdateInputs.error;
		}

		const updatedTrades = await createTransaction(async (sql) => {
			const updatePromises = parseUpdateInputs.data.map(async (input) => {
				const [updatedTrade] = await sql<Trade[]>`
               update ${sql(TRADES_TABLES.trades)}
               set ${sql(input)}
               where id = ${input.id}
               returning *
            `;
				return updatedTrade;
			});
			return await Promise.all(updatePromises);
		});

		return updatedTrades;
	}
);
