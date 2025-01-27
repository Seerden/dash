import type { Datelike } from "@shared/types/utility.types";
import { isYearMonthDay } from "types/data.types";

/** Takes a Datelike and returns the unix millisecond timestamp for it.
 * @todo test this once we've implemented more functionality to test it with. */
export function toTimestamp(timestamp: Datelike) {
	return new Date(timestamp).valueOf();
}

/** Parse a Date to YYYY-MM-DD (@note don't have dayjs installed yet) */
export function formatToYearMonthDate(date: Date) {
	const formatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

	if (!isYearMonthDay(formatted)) {
		throw new Error(`Invalid date: ${formatted}`);
	}
	return formatted;
}
