export type Ticker = string;

/**YYYY-MM-DD string.
 * @deprecated Use `YearMonthDay` from shared/types/date.types.ts instead.
 */
export type YearMonthDay = `${number}-${number}-${number}`;

/**
 * @deprecated Use `isYearMonthDay` from shared/types/date.types.ts instead.
 */
export function isYearMonthDay(date: string): date is YearMonthDay {
	return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * @deprecated Use `isYearMonthDay` from shared/types/date.types.ts instead.
 */
export type YearMonthDayObject = {
	year: string;
	month: string;
	day: string;
};
