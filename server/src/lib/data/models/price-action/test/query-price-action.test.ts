import { sqlConnection } from "@/db/init";
import { insertPriceAction } from "@/lib/data/models/price-action/insert-price-action";
import { mockManyPriceActionRows } from "@/lib/data/models/price-action/mock";
import {
	queryPriceActionFlat,
	queryPriceActionGrouped,
	queryTimestamps,
} from "@/lib/data/models/price-action/query-price-action";
import { priceActionWithUpdatedAtSchema } from "types/price-action.types";

describe("queryPriceAction", () => {
	describe("flat", () => {
		it("should return a price action list", async () => {
			await sqlConnection.begin(async (sql) => {
				await insertPriceAction({ sql, priceAction: mockManyPriceActionRows(10) });

				const rows = await queryPriceActionFlat({ sql });
				expect(rows.length).toBe(10);

				expect(priceActionWithUpdatedAtSchema.safeParse(rows[0]).success).toBe(true);

				const rowsWithEndDate = await queryPriceActionFlat({ sql, to: new Date(5) });
				expect(rowsWithEndDate.length).toBe(6);

				const rowsWithStartDate = await queryPriceActionFlat({
					sql,
					from: new Date(5),
				});
				expect(rowsWithStartDate.length).toBe(5);

				const rowsWithStartAndEndDate = await queryPriceActionFlat({
					sql,
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
		])("should return a price action list grouped by %s", async (groupBy, key) => {
			await sqlConnection.begin(async (sql) => {
				await insertPriceAction({ sql, priceAction: mockManyPriceActionRows(10) });
				const rows = await queryPriceActionGrouped({
					sql,
					groupBy: groupBy as "ticker" | "timestamp",
				});

				expect(Object.keys(rows)).toContain(key);

				const parsed = priceActionWithUpdatedAtSchema.safeParse(rows[key].at(0));
				expect(parsed.success).toBe(true);

				await sql`rollback`;
			});
		});
	});

	describe("queryTimestamps", () => {
		it("should return a list of timestamps", async () => {
			await sqlConnection.begin(async (sql) => {
				await insertPriceAction({
					sql,
					priceAction: mockManyPriceActionRows(10).concat(
						mockManyPriceActionRows(11),
					),
				});

				// the first 10 items are entered twice, so we should have 11 unique timestamps.
				const timestamps = await queryTimestamps({ sql });
				expect(timestamps.length).toBe(11);

				await sql`rollback`;
			});
		});
	});
});
