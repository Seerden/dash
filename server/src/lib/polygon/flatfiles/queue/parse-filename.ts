import { isYearMonthDay, type YearMonthDay } from "types/data.types";

/** Takes a path like
 * `[/dash/]flatfiles/daily_aggs_v1/<year>/<month>/<year>-<month>-<day>.csv[.gz]`
 * and returns an object containing { year, month, day }. */
export function parseDailyAggsFilename(filepath: string) {
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
}: {
	year: string;
	month: string;
	day: string;
}): YearMonthDay {
	const yearMonthDay = `${year}-${month}-${day}`;

	if (!isYearMonthDay(yearMonthDay)) {
		throw new Error(
			`Invalid filename: ${yearMonthDay}, flatFiles must be formatted like  "<year>-<month>-<day>.csv.gz"`,
		);
	}

	return yearMonthDay;
}

/** Helper that parses YYYY-MM-DD to a filename that can be passed to `insertFromCsv`. */
export function parseDailyAggsJobFilenameToCsvFilename(filename: YearMonthDay) {
	const [year, month, _day] = filename.split("-");
	return `day_aggs_v1/${year}/${month}/${filename}.csv.gz`;
}
