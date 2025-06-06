import day from "@shared/lib/datetime/day";
import {
	isYearMonthDay,
	YearMonthDay,
	YearMonthDayObject,
} from "@shared/types/date.types";
import type { Datelike } from "@shared/types/utility.types";
import dayjs from "dayjs";

/** Takes a Datelike and returns the unix millisecond timestamp for it.
 * @todo test this once we've implemented more functionality to test it with. */
export function toTimestamp(timestamp: Datelike) {
	return day(timestamp).valueOf();
}

/** Parse a Date to YYYY-MM-DD */
export function formatToYearMonthDay(date: Datelike) {
	const formatted = dayjs(date).format("YYYY-MM-DD");

	if (!isYearMonthDay(formatted)) throw new Error(`Invalid date: ${formatted}`);

	return formatted;
}

/** Parse a YearMonthDay string to a YearMonthDayObject.
 * @todo test this function  */
export function toYearMonthDayObject(date: YearMonthDay): YearMonthDayObject {
	const [year, month, day] = date.split("-");
	return { year, month, day };
}
