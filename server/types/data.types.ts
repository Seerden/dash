export type Ticker = string;

/**YYYY-MM-DD string. */
export type YearMonthDay = `${number}-${number}-${number}`;

export function isYearMonthDay(date: string): date is YearMonthDay {
	return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export type YearMonthDayObject = {
	year: string;
	month: string;
	day: string;
};
