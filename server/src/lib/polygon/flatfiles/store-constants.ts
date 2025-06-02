export const priceActionStoreKeys = {
	daily: "polygon:flatfiles:daily:parsed",
	minute: "polygon:flatfiles:minute:parsed",
} as const;

export const ERRORS = {
	INVALID_FILENAME: (filename: string) =>
		new Error(
			`Invalid filename: ${filename}, flatFiles must be formatted like  '<year>-<month>-<day>.csv.gz'`,
		),
};
