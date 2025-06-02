import type { Datelike } from "@shared/types/utility.types";
import dayjs from "dayjs";
import type { YearMonthDay, YearMonthDayObject } from "types/data.types";
import { isYearMonthDay } from "types/data.types";

/** Takes a Datelike and returns the unix millisecond timestamp for it.
 * @todo test this once we've implemented more functionality to test it with. */
export function toTimestamp(timestamp: Datelike) {
	return new Date(timestamp).valueOf();
}

/** Parse a Date to YYYY-MM-DD */
export function formatToYearMonthDay(date: Date) {
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
