export const BUCKET = "flatfiles";
export const PREFIX = "us_stocks_sip";
export enum FOLDERS {
	DAY_AGGS = "day_aggs_v1",
	MINUTE_AGGS = "minute_aggs_v1",
	QUOTES = "quotes_v1",
	TRADES = "trades_v1",
}
export const ENDPOINT = "https://files.polygon.io";

export const {
	POLYGON_SECRET_ACCESS_KEY,
	POLYGON_ACCESS_KEY_ID,
	POLYGON_FLAT_FILES_URL,
} = process.env;
