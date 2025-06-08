import { proxyClient } from "@/lib/trpc";
import { formatToYearMonthDay } from "@shared/lib/datetime/timestamp";
import { priceActionWithUpdatedAtSchema } from "@shared/types/price-action.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import dayjs from "dayjs";
import type { FlatPriceActionQuery } from "types/price-action.types";
import {
	flatPriceActionQuerySchema,
	groupedPriceActionQuerySchema,
} from "types/price-action.types";

// TODO: these might fail if the database isn't populated (which is the case on
// my laptop).)
describe("flatDailyPriceActionResolver", () => {
	it("should make a query with the proper limit", async () => {
		const input: FlatPriceActionQuery = {
			limit: 10,
			tickers: [],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: "2025-01-22",
			to: "2025-01-23",
		};
		const output = await proxyClient.priceAction.daily.flat.query(input);
		expect(output.length).toBe(10);
	});
	it("should make a query with the proper tickers", async () => {
		const input: FlatPriceActionQuery = {
			limit: 1e4,
			tickers: ["NVDA", "MSFT"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: "2025-01-22",
			to: "2025-01-23",
		};

		const output = await proxyClient.priceAction.daily.flat.query(input);
		expect(output.length).toBe(2);
		expect(priceActionWithUpdatedAtSchema.parse(output[0])).toEqual(
			expect.objectContaining({ ticker: "MSFT" }),
		);
	});
	it("should return empty list when querying the future", async () => {
		const input: FlatPriceActionQuery = {
			limit: 1e4,
			tickers: ["NVDA", "MSFT"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: formatToYearMonthDay(dayjs().add(1, "day").toDate()),
			to: formatToYearMonthDay(dayjs().add(2, "day").toDate()),
		};

		const output = await proxyClient.priceAction.daily.flat.query(input);
		expect(output.length).toBe(0);
	});
	it("should filter groupBy from input object", async () => {
		const input = {
			limit: 1e4,
			tickers: ["NVDA", "MSFT"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: formatToYearMonthDay(dayjs().add(1, "day").toDate()),
			to: formatToYearMonthDay(dayjs().add(2, "day").toDate()),
			groupBy: "ticker",
		};

		expect(flatPriceActionQuerySchema.safeParse(input)).not.toEqual(
			expect.objectContaining({ groupBy: "ticker" }),
		);
	});
});

describe("groupedDailyPriceActionResolver", () => {
	it("should make a query with the proper limit", async () => {
		const input = {
			limit: 10,
			tickers: [],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: "2025-01-22",
			to: "2025-01-23",
			groupBy: "ticker" as const,
		};
		const output = await proxyClient.priceAction.daily.grouped.query(input);
		expect(output).toBeDefined();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(output?.size).toBe(10);
	});
	it("should make a query with the proper tickers", async () => {
		const input = {
			limit: 10,
			tickers: ["MSFT", "NVDA"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: "2025-01-21", // query multiple days
			to: "2025-01-23", // ^
			groupBy: "ticker" as const,
		};
		const output = await proxyClient.priceAction.daily.grouped.query(input);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(output?.size).toBe(2);
	});

	it("should return null when querying the future", async () => {
		const input = {
			limit: 10,
			tickers: ["MSFT", "NVDA"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: formatToYearMonthDay(dayjs().add(1, "day").toDate()),
			to: formatToYearMonthDay(dayjs().add(2, "day").toDate()),
			groupBy: "ticker" as const,
		};
		const output = await proxyClient.priceAction.daily.grouped.query(input);
		expect(output).toBeNull();
	});

	it("should not filter out groupBy from input object", async () => {
		const input = {
			limit: 1e4,
			tickers: ["NVDA", "MSFT"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: formatToYearMonthDay(dayjs().add(1, "day").toDate()),
			to: formatToYearMonthDay(dayjs().add(2, "day").toDate()),
			groupBy: "ticker",
		};

		expect(groupedPriceActionQuerySchema.parse(input)).toEqual(
			expect.objectContaining({ groupBy: "ticker" }),
		);
	});

	it("should query by timestamp", async () => {
		const input = {
			limit: 1e4,
			tickers: ["NVDA", "MSFT"],
			minVolume: 0,
			table: PRICE_ACTION_TABLES.DAILY,
			from: "2025-01-21",
			to: "2025-01-22",
			groupBy: "timestamp" as const,
		};

		const output = await proxyClient.priceAction.daily.grouped.query(input);
		console.log({ output });
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(output?.size).toBe(1);

		input.to = formatToYearMonthDay(dayjs("2025-01-21").add(2, "day").toDate());
		const output2 = await proxyClient.priceAction.daily.grouped.query(input);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(output2?.size).toBe(2);
	});
});
