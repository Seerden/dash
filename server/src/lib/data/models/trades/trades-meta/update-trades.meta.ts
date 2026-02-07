import { TRADES_TABLES } from "@shared/types/table.types";
import type { UpdateTradeMetaInput } from "@shared/types/trades.input.types";
import type { TradeMeta } from "@shared/types/trades.types";
import { createTransaction, query } from "@/lib/query-function";

export const updateTradesMeta = query(
	async ({ tradeMeta }: { tradeMeta: UpdateTradeMetaInput[] }) => {
		return await createTransaction(async (sql) => {
			const updatePromises = tradeMeta.map(async (meta) => {
				const [updatedMeta] = await sql<TradeMeta[]>`
            update ${TRADES_TABLES.meta}
            set ${sql(meta)}
            where id = ${meta.id}
            returning *
         `;
				return updatedMeta;
			});
			return await Promise.all(updatePromises);
		});
	}
);
