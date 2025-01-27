import { sqlConnection } from "@/db/init";
import {
	fetchParseAndInsertGroupedDaily,
	removeParsedDataFile,
} from "@/lib/data/models/price-action/parse-and-insert-price-action";
import fs from "fs/promises";
import { priceActionWithUpdatedAtSchema } from "types/price-action.types";

describe("parseAndInsertPriceAction", () => {
	it("should parse and insert price action", async () => {
		await sqlConnection.begin(async (sql) => {
			const data = await fetchParseAndInsertGroupedDaily({ date: "2025-01-21", sql });
			expect(data).toBeDefined();
			const firstRow = data[0];
			expect(priceActionWithUpdatedAtSchema.safeParse(firstRow).success).toBeTruthy();
			// TODO: use a timestamp helper to expect end-of-market-session
			// timestamp for the given date.
			expect(new Date(firstRow.timestamp)).toEqual(
				new Date("2025-01-21T21:00:00.000Z"),
			);

			// clean up
			const path = new URL(`../parsed-data/2025-01-21.json`, import.meta.url);
			expect(await fs.readFile(path)).toBeDefined();
			await removeParsedDataFile("2025-01-21");
			await expect(fs.readFile(path)).rejects.toThrowError();
			await sql`rollback to savepoint insert_price_action`;
			await sql`release savepoint insert_price_action`;
		});
	});
});
