import { sqlConnection } from "@/db/init";
import { insertPriceAction } from "@/lib/data/models/price-action/insert-price-action";
import { mockManyPriceActionRows } from "@/lib/data/models/price-action/mock";
import { priceActionWithUpdatedAtSchema } from "@shared/types/price-action.types";

describe("insertPriceAction", () => {
	it("should insert a single row", async () => {
		const rows = mockManyPriceActionRows(1);

		await sqlConnection.begin(async (q) => {
			const inserted = await insertPriceAction({
				sql: q,
				priceAction: rows,
			});
			expect(inserted).toHaveLength(1);
			expect(priceActionWithUpdatedAtSchema.safeParse(inserted.at(-1)).success).toBe(
				true,
			);

			await q`rollback to savepoint insert_price_action`;
			await q`release savepoint insert_price_action`;
		});
	});

	it("should insert a large number of rows", async () => {
		const rows = mockManyPriceActionRows(1e4);

		await sqlConnection.begin(async (q) => {
			const inserted = await insertPriceAction({ sql: q, priceAction: rows });
			expect(inserted).toHaveLength(rows.length);
			expect(priceActionWithUpdatedAtSchema.safeParse(inserted.at(-1)).success).toBe(
				true,
			);

			await q`rollback to savepoint insert_price_action`;
			await q`release savepoint insert_price_action`;
		});
	});
});
