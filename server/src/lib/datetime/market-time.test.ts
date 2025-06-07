/**
 * @todo I do not have testing set up in the `shared` package yet, so I am
 * implementing these unit tests in here for now.
 */

import day from "@shared/lib/datetime/day";
import {
	generateDateRange,
	generateMarketDateRange,
	getNextMarketDate,
	getPreviousMarketDate,
	isMarketDay,
	maxPolygonLookback,
} from "@shared/lib/datetime/market-time";
import { formatToYearMonthDay } from "@shared/lib/datetime/timestamp";

describe("marketTime", () => {
	describe("generateDateRange", () => {
		it("should generate nothing if from and to are not separate dates in the right order", () => {
			const from = day();
			const to = from.subtract(1, "day");
			const dates = generateDateRange({
				from: formatToYearMonthDay(from),
				to: formatToYearMonthDay(to),
			});
			expect(dates).toEqual([]);
		});
		it("should generate a range of dates including both `from` and `to`", () => {
			const from = day("2025-12-25");
			const to = day("2025-12-31");
			const dates = generateDateRange({
				from: formatToYearMonthDay(from),
				to: formatToYearMonthDay(to),
			});
			expect(dates).toEqual([
				"2025-12-25",
				"2025-12-26",
				"2025-12-27",
				"2025-12-28",
				"2025-12-29",
				"2025-12-30",
				"2025-12-31",
			]);
		});
	});

	describe("generateMarketDateRange", () => {
		it("generates a range of dates on a week containing a holiday", () => {
			const from = day("2025-05-26");
			const to = day("2025-06-02");
			const dates = generateMarketDateRange({
				from: formatToYearMonthDay(from),
				to: formatToYearMonthDay(to),
			});
			expect(dates).toEqual([
				"2025-05-27",
				"2025-05-28",
				"2025-05-29",
				"2025-05-30",
				"2025-06-02",
			]);
		});

		it("generates a range of dates on a week without a holiday", () => {
			const from = day("2025-06-02");
			const to = day("2025-06-08");
			const dates = generateMarketDateRange({
				from: formatToYearMonthDay(from),
				to: formatToYearMonthDay(to),
			});
			expect(dates).toEqual([
				"2025-06-02",
				"2025-06-03",
				"2025-06-04",
				"2025-06-05",
				"2025-06-06",
			]);
		});

		it("returns an empty array if from and to are not separate dates in the right order", () => {
			const from = day("2025-06-08");
			const to = from.subtract(1, "day");
			const dates = generateMarketDateRange({
				from: formatToYearMonthDay(from),
				to: formatToYearMonthDay(to),
			});
			expect(dates).toEqual([]);
		});
	});

	describe("isMarketDay", () => {
		it("should return true for a market day", () => {
			expect(isMarketDay(formatToYearMonthDay(day("2025-01-02")))).toBe(true);
		});

		it("should return false for a weekend", () => {
			expect(isMarketDay(formatToYearMonthDay(day("2025-01-04")))).toBe(false); // a Saturday
		});

		it("should return false for a holiday", () => {
			expect(isMarketDay(formatToYearMonthDay(day("2025-01-01")))).toBe(false); // New Year's
		});
	});

	describe("lastCompleteMarketSession", () => {});

	describe("getPreviousMarketDate", () => {
		it("should not see a holiday as a previous trading date", () => {
			expect(getPreviousMarketDate("2025-01-02")).toEqual("2024-12-31"); // 2024/12/31 was a tuesday
		});
		it("should see a regular monday as a previous trading date w.r.t. a tuesday", () => {
			expect(getPreviousMarketDate("2025-01-07")).toEqual("2025-01-06"); // 2025/01/06 was a monday
		});
		it("should see a friday as a previous trading date w.r.t. a monday", () => {
			expect(getPreviousMarketDate("2025-01-06")).toEqual("2025-01-03"); // 2025/01/03 was a friday
		});
	});
	// basically the inverse of getPreviousMarketDate
	describe("getNextMarketDate", () => {
		it("should not see a holiday as a next trading date", () => {
			expect(getNextMarketDate("2025-01-01")).toEqual("2025-01-02"); // 2025/01/02 was a thursday
		});
		it("should see a regular monday as a next trading date w.r.t. a friday", () => {
			expect(getNextMarketDate("2025-01-03")).toEqual("2025-01-06"); // 2025/01/06 was a monday
		});
		it("should see a tuesday as a next trading date w.r.t. a monday", () => {
			expect(getNextMarketDate("2025-01-06")).toEqual("2025-01-07"); // 2025/01/07 was a tuesday
		});
	});

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
