import { time } from "@shared/lib/datetime/constants";
import day from "@shared/lib/datetime/day";
import { holidays } from "@shared/lib/datetime/market-holidays";
import { dateFormatter } from "@shared/lib/datetime/new-york-formatter";
import { formatToYearMonthDay } from "@shared/lib/datetime/timestamp";
import { YearMonthDay } from "@shared/types/date.types";
import { PriceAction } from "@shared/types/price-action.types";
import { Datelike } from "@shared/types/utility.types";
import { Dayjs } from "dayjs";

/** Generates a list of YYYY-MM-DD values in the inclusive range [from, to]. */
export function generateDateRange({
	from,
	to,
}: {
	from: YearMonthDay;
	to: YearMonthDay;
}) {
	const fromDayjs = day(from);
	const toDayjs = day(to);
	if (fromDayjs.isSame(toDayjs, "day") || !toDayjs.isAfter(fromDayjs, "day")) {
		return [];
	}

	const dates: YearMonthDay[] = [from];

	const [fromDate, toDate] = [from, to].map(day);
	let nextDate: Dayjs = fromDate;
	while (nextDate.isBefore(toDate)) {
		nextDate = day(nextDate).add(1, "day");
		dates.push(formatToYearMonthDay(nextDate));
	}
	return dates;
}

/** Generate a list of market dates in range {from, to}; if either (or both) are
 * in the future, return the date for the latest market session. */
export function generateMarketDateRange({
	from,
	to,
}: {
	from: YearMonthDay;
	to: YearMonthDay;
}) {
	let start = from;
	let end = to;

	if (!day(end).isAfter(day(start), "day")) {
		return [];
	}

	const lastSession = lastCompleteMarketSession();
	if (day(start).isAfter(lastSession)) start = lastSession;
	if (day(end).isAfter(lastSession)) end = lastSession;

	const dates = generateDateRange({ from: start, to: end });
	return dates.filter(isMarketDay);
}

function isWeekend(date: YearMonthDay) {
	const d = day(date).day();
	return d === 0 || d === 6;
}

function isHoliday(date: YearMonthDay) {
	return holidays.includes(date);
}

export function isMarketDay(date: YearMonthDay) {
	return !isWeekend(date) && !isHoliday(date);
}

export function lastCompleteMarketSession() {
	const now = day();
	const nowDate = formatToYearMonthDay(now);
	return now.isAfter(marketTime.afterHoursClose(nowDate))
		? nowDate
		: getPreviousMarketDate(nowDate);
}

export function getPreviousMarketDate(date: YearMonthDay): YearMonthDay {
	let previousDay = dayBefore(date);
	while (!isMarketDay(previousDay)) {
		previousDay = dayBefore(previousDay);
	}
	return previousDay;
}

export function getNextMarketDate(date: YearMonthDay): YearMonthDay {
	let nextDay = dayAfter(date);
	while (!isMarketDay(nextDay)) {
		nextDay = dayAfter(nextDay);
	}
	return nextDay;
}

export function toUnixMs(date: Datelike) {
	return day(date).valueOf();
}

export function dayBefore(date: YearMonthDay) {
	return formatToYearMonthDay(day(date).subtract(1, "day"));
}

// TODO: can probably combine "after" and "before", and also combine
// getNextMarketDate and getPreviousMarketDate as well (since there n=1, but
// otherwise it's the same thing).)
export function nMarketDaysAfter(date: YearMonthDay, n: number) {
	let nextDay = date;
	for (let i = 0; i < n; i++) {
		nextDay = getNextMarketDate(nextDay);
	}
	return nextDay;
}

export function nMarketDaysBefore(date: YearMonthDay, n: number) {
	let previousDay = date;
	for (let i = 0; i < n; i++) {
		previousDay = getPreviousMarketDate(previousDay);
	}
	return previousDay;
}

export function dayAfter(date: YearMonthDay) {
	return formatToYearMonthDay(day(date).add(1, "day"));
}

// TODO DAS-38: fix tsconfig to allow this to be used in both browser and node
// export async function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export function maxPolygonLookback() {
	return formatToYearMonthDay(day().subtract(5, "year").add(1, "day"));
}

/** Create a timestamp for `date` and `time`, where `date` and `time` are New
 * York (market time) local. */
function marketTimestamp(date: YearMonthDay, time: string) {
	return day.tz(`${date} ${time}`, "America/New_York").unix() * 1000;
}

function marketOpen(date: YearMonthDay) {
	return marketTimestamp(date, time.market.open);
}

function marketClose(date: YearMonthDay) {
	return marketTimestamp(date, time.market.close);
}

function premarketOpen(date: YearMonthDay) {
	return marketTimestamp(date, time.market.premarketOpen);
}

function afterHoursClose(date: YearMonthDay) {
	return marketTimestamp(date, time.market.afterHoursClose);
}

export function timestampToMarketTime(timestamp: PriceAction["timestamp"]) {
	const timestampAsDate = day(timestamp).toDate();
	return dateFormatter.format(timestampAsDate); // Use the formatter instead of dayjs because it's 100x faster
}

export function timestampToMarketDate(timestamp: PriceAction["timestamp"]) {
	return formatToYearMonthDay(day.tz(timestamp, "America/New_York"));
}

export const marketTime = {
	timestamp: marketTimestamp,
	close: marketClose,
	open: marketOpen,
	premarketOpen,
	afterHoursClose,
};
