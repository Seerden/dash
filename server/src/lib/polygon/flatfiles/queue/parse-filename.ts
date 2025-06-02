import type { FOLDERS } from "@/lib/polygon/flatfiles/constants";
import type { YearMonthDayObject } from "types/data.types";
import { isYearMonthDay, type YearMonthDay } from "types/data.types";

/** Extracts a `YearMonthDayObject` from a filepath like
 * `[/dash/]flatfiles/{daily_aggs_v1|minute_aggs_v1}/<year>/<month>/<year>-<month>-<day>.csv[.gz]`
 **/
export function aggsFilenameToYMD(filepath: string): YearMonthDayObject {
	const file = filepath.split("/").at(-1);
	if (!file) {
		// TODO: put this in an ERRORS constant somewhere
		throw new Error(
			`Invalid filename: ${filepath}, flatFiles must be formatted like  "<year>-<month>-<day>.csv.gz"`,
		);
	}

	const [year, month, day] = file.split(".")[0].split("-");
	return { year, month, day };
}

/** Takes an object containing { year, month, day } and returns a string
 * formatted like "YYYY-MM-DD".
 * @todo can replace this with a dayjs function */
export function yearMonthDayToString({
	year,
	month,
	day,
}: YearMonthDayObject): YearMonthDay {
	const yearMonthDay = `${year}-${month}-${day}`;

	if (!isYearMonthDay(yearMonthDay)) {
		throw new Error(
			`Invalid filename: ${yearMonthDay}, flatFiles must be formatted like  "<year>-<month>-<day>.csv.gz"`,
		);
	}

	return yearMonthDay;
}

/** Helper that parses YYYY-MM-DD to a filename that can be passed to `insertAggsFromCsv`.
 * @note this works for both daily and minute aggs */
export function parseAggsJobFilenameToCsvFilename({
	filename,
	folder,
}: {
	filename: YearMonthDay;
	folder: `${FOLDERS}`;
}) {
	const [year, month, _day] = filename.split("-");
	return `${folder}/${year}/${month}/${filename}.csv.gz`;
}
