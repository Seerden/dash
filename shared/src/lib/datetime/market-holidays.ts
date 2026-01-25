import { formatToYearMonthDay } from "./timestamp";

/** Get the YearMonthDay string for the given date string (like `January 2nd`)
 * and year (like 2025).
 * @usage helper function to determine market holidays. */
function yearAndDateToYearMonthDate({
	dateString,
	year,
}: {
	dateString: string;
	year: string | number;
}) {
	return formatToYearMonthDay(`${dateString} ${year}`);
}

/** Lists all dates in the past few years on which the market was closed, or
 * closed early. */
const holidaysMap: Record<string, string[]> = {
	2025: [
		"January 1",
		"January 20",
		"February 17",
		"April 18",
		"May 26",
		"June 19",
		"July 4",
		"September 1",
		"November 27",
		"December 25",
	],
	2024: [
		"January 1",
		"January 15",
		"February 19",
		"March 29",
		"May 27",
		"June 19",
		"July 4",
		"September 2",
		"November 28",
		"December 25",
	],
	2023: [
		"January 2",
		"January 16",
		"February 20",
		"April 7",
		"May 29",
		"June 19",
		"July 4",
		"September 4",
		"November 23",
		"December 25",
	],
	2022: [
		"January 17",
		"February 21",
		"April 15",
		"May 30",
		"June 20",
		"July 4",
		"September 5",
		"November 24",
		"December 26",
	],
	2021: [
		"January 1",
		"January 18",
		"February 15",
		"April 2",
		"May 31",
		"July 5",
		"September 6",
		"November 25",
		"December 24",
	],
	2020: [
		"January 1",
		"January 20",
		"February 17",
		"April 10",
		"May 25",
		"July 3",
		"September 7",
		"November 26",
		"December 25",
	],
	2019: [
		"January 1",
		"January 21",
		"February 18",
		"April 19",
		"May 27",
		"July 4",
		"September 2",
		"November 28",
		"December 25",
	],
	2018: [
		"January 1",
		"January 15",
		"February 19",
		"March 30",
		"May 28",
		"July 4",
		"September 3",
		"November 22",
		"December 5",
		"December 25",
	],
};

export const holidays = Object.entries(holidaysMap).flatMap(([year, dates]) =>
	dates.map((dateString) => yearAndDateToYearMonthDate({ dateString, year }))
);
