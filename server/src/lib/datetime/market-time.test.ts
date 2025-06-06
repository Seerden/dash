/**
 * @todo I do not have testing set up in the `shared` package yet, so I am
 * implementing these unit tests in here for now.
 */

import day from "@shared/lib/datetime/day";
import { generateDateRange, maxPolygonLookback } from "@shared/lib/datetime/market-time";
import { formatToYearMonthDay } from "@shared/lib/datetime/timestamp";

describe("marketTime", () => {
	describe("generateDateRange", () => {
		it("should generate nothing if from and to are not separate dates in the right order", () => {
			const from = day();
			const to = from.subtract(1, "day");
			const dates = generateDateRange(
				formatToYearMonthDay(from),
				formatToYearMonthDay(to),
			);
			expect(dates).toEqual([]);
		});
		it("should generate a range of dates including both `from` and `to`", () => {
			const from = day("2025-12-25");
			const to = day("2025-12-31");
			const dates = generateDateRange(
				formatToYearMonthDay(from),
				formatToYearMonthDay(to),
			);
			expect(dates).toEqual([
				"2025-12-25",
				"2025-12-26",
				"2025-12-27",
				"2025-12-28",
				"2025-12-29",
				"2025-12-30",
				"2025-12-31",
			] as const);
		});
	});

	describe("generateMarketDateRange", () => {});

	describe("isMarketDay", () => {});

	describe("lastCompleteMarketSession", () => {});

	describe("getPreviousMarketDate", () => {});
	describe("getNextMarketDate", () => {});

	describe("toUnixMs", () => {});
	describe("dayBefore", () => {});
	describe("nMarketDaysfter", () => {});
	describe("nMarketDaysBefore");
	describe("dayAfter", () => {});

	describe("maxPolygonLookback", () => {
		it("should return a date five years ago", () => {
			const maxLookback = maxPolygonLookback();
			const maxLookbackDayjs = day(maxLookback);
			expect(maxLookbackDayjs.year()).toEqual(day().year() - 5);
		});
	});

	describe("timestampToMarketTime", () => {});
	describe("timestampToMarketDate", () => {});

	describe("marketTime", () => {
		describe("timestamp", () => {});
		describe("marketClose", () => {});
		describe("marketOpen", () => {});
		describe("premarketOpen", () => {});
		describe("afterHoursClose", () => {});
	});
});
