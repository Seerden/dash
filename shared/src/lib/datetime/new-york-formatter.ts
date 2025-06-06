/** DateTimeFormat formatter for the New York timezone. */
export const dateFormatter = Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	timeZone: "America/New_York",
	hour12: false,
	hour: "2-digit",
	minute: "2-digit",
});

/** Create a time formatter in New York's timezone, optionally with seconds. */
export function getTimeFormatter(second = false) {
	return Intl.DateTimeFormat("en-US", {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: second ? "2-digit" : undefined,
		timeZone: "America/New_York",
	});
}
