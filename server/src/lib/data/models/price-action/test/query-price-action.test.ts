/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { priceActionWithUpdatedAtSchema } from "@shared/types/price-action.types";
import { insertPriceAction } from "@/lib/data/models/price-action/insert-price-action";
import { mockManyPriceActionRows } from "@/lib/data/models/price-action/mock";
import {
	queryPriceActionFlat,
	queryPriceActionGrouped,
	queryTimestamps,
} from "@/lib/data/models/price-action/query-price-action";
import { createTransaction } from "@/lib/query-function";

describe("queryPriceAction", () => {
	describe("flat", () => {
		it("should return a price action list", async () => {
			await createTransaction(async (sql) => {
				await insertPriceAction({ priceAction: mockManyPriceActionRows(10) });

				const rows = await queryPriceActionFlat();
				expect(rows.length).toBe(10);

				expect(priceActionWithUpdatedAtSchema.safeParse(rows[0]).success).toBe(
					true
				);

				const rowsWithEndDate = await queryPriceActionFlat({
					to: new Date(5),
					from: null,
				});
				expect(rowsWithEndDate.length).toBe(6);

				const rowsWithStartDate = await queryPriceActionFlat({
					from: new Date(5),
					to: null,
				});
				expect(rowsWithStartDate.length).toBe(5);

				const rowsWithStartAndEndDate = await queryPriceActionFlat({
					from: new Date(3),
					to: new Date(5),
				});
				expect(rowsWithStartAndEndDate.length).toBe(3);

				await sql`rollback`;
			});
		});
	});

	describe("grouped", () => {
		test.each([
			["ticker", "MSFT"],
			["timestamp", new Date(0).valueOf().toString()],
		])(
			"should return a price action list grouped by %s",
			async (groupBy, key) => {
				await createTransaction(async (sql) => {
					await insertPriceAction({ priceAction: mockManyPriceActionRows(10) });
					const rows = await queryPriceActionGrouped({
						groupBy: groupBy as "ticker" | "timestamp",
						to: null,
						from: null,
					});

					expect(Array.from(rows!.keys())).toContain(key);

					const parsed = priceActionWithUpdatedAtSchema.safeParse(
						rows!.get(key)!.at(0)
					);
					expect(parsed.success).toBe(true);

					await sql`rollback`;
				});
			}
		);
	});

	describe("queryTimestamps", () => {
		it("should return a list of timestamps", async () => {
			await createTransaction(async (sql) => {
				await insertPriceAction({
					priceAction: mockManyPriceActionRows(10).concat(
						mockManyPriceActionRows(11)
					),
				});

				// the first 10 items are entered twice, so we should have 11 unique timestamps.
				const timestamps = await queryTimestamps();
				expect(timestamps.length).toBe(11);

				await sql`rollback`;
			});
		});
	});
});
