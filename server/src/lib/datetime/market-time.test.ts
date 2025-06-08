/**
 * @todo I do not have testing set up in the `shared` package yet, so I am
 * implementing these unit tests in here for now.
 */

import day from "@shared/lib/datetime/day";
import {
	dayAfter,
	dayBefore,
	generateDateRange,
	generateMarketDateRange,
	getNextMarketDate,
	getPreviousMarketDate,
	isMarketDay,
	lastCompleteMarketSession,
	marketTime,
	maxPolygonLookback,
	nMarketDaysAfter,
	nMarketDaysBefore,
	timestampToMarketDate,
	timestampToMarketTime,
	toUnixMs,
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

	describe("lastCompleteMarketSession", () => {
		const lastSession = lastCompleteMarketSession();
		const diff = day().diff(day(lastSession), "day");
		expect(diff).not.toBeLessThan(0); // should never be in the future
	});

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

	describe("toUnixMs", () => {
		expect(toUnixMs("2025-01-02")).toEqual(1735776000000);
	});
	describe("dayBefore", () => {
		expect(dayBefore("2025-01-02")).toEqual("2025-01-01");
		expect(dayBefore("2025-01-01")).toEqual("2024-12-31");
	});
	describe("nMarketDaysfter", () => {
		expect(nMarketDaysAfter("2025-01-02", 1)).toEqual("2025-01-03");
		expect(nMarketDaysAfter("2025-06-02", 4)).toEqual("2025-06-06");
		expect(nMarketDaysAfter("2025-05-23", 7)).toEqual("2025-06-04");
	});
	describe("nMarketDaysBefore", () => {
		// inverse of nMarketDaysAfter
		expect(nMarketDaysBefore("2025-01-03", 1)).toEqual("2025-01-02");
		expect(nMarketDaysBefore("2025-06-06", 4)).toEqual("2025-06-02");
		expect(nMarketDaysBefore("2025-06-04", 7)).toEqual("2025-05-23");
	});
	describe("dayAfter", () => {
		expect(dayAfter("2025-01-02")).toEqual("2025-01-03");
		expect(dayAfter("2024-12-31")).toEqual("2025-01-01");
	});

	describe("maxPolygonLookback", () => {
		it("should return a date five years ago", () => {
			const maxLookback = maxPolygonLookback();
			const maxLookbackDayjs = day(maxLookback);
			expect(maxLookbackDayjs.year()).toEqual(day().year() - 5);
		});
	});

	describe("timestampToMarketTime", () => {
		it("should return the correct market (New York) time for a timestamp", () => {
			const t = timestampToMarketTime("2025-01-02T15:30:00Z");
			expect(t).toEqual("01/02/2025, 10:30");
		});
	});
	describe("timestampToMarketDate", () => {
		it("should return the correct market (New York) date for a timestamp", () => {
			const t = timestampToMarketDate("2025-01-02T15:30:00Z");
			expect(t).toEqual("2025-01-02");
		});
	});

	describe("marketTime", () => {
		describe("timestamp", () => {
			it("should return the correct timestamp for a given date and time in New York timezone", () => {
				const timestamp = marketTime.timestamp({ date: "2025-01-02", time: "09:30" });
				expect(timestamp).toEqual(1735828200000); // 2025-01-02 09:30:00 in New York timezone
			});
		});
		describe("marketClose", () => {
			it("should return the correct market close timestamp for a given date in New York timezone", () => {
				const closeTimestamp = marketTime.close("2025-01-02");
				expect(closeTimestamp).toEqual(1735851600000); // 2025-01-02 16:00:00 in New York timezone
			});
		});
		describe("marketOpen", () => {
			it("should return the correct market open timestamp for a given date in New York timezone", () => {
				const openTimestamp = marketTime.open("2025-01-02");
				expect(openTimestamp).toEqual(1735828200000); // 2025-01-02 09:30:00 in New York timezone
			});
		});
		describe("premarketOpen", () => {
			it("should return the correct premarket open timestamp for a given date in New York timezone", () => {
				const premarketTimestamp = marketTime.premarketOpen("2025-01-02");
				expect(premarketTimestamp).toEqual(1735808400000); // 2025-01-02 04:00:00 in New York timezone
			});
		});
		describe("afterHoursClose", () => {
			it("should return the correct after-hours close timestamp for a given date in New York timezone", () => {
				const afterHoursTimestamp = marketTime.afterHoursClose("2025-01-02");
				expect(afterHoursTimestamp).toEqual(1735866000000); // 2025-01-02 20:00:00 in New York timezone
			});
		});
	});
});
