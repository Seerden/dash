import type { YearMonthDay } from "@shared/types/date.types";
import type { Ticker } from "types/data.types";

export type ResponseBase = {
	/** The exchange symbol that this item is traded under. */
	ticker: string;
	/** Whether or not this response was adjusted for splits. */
	adjusted: boolean;
	/** The number of aggregates (minute or day) used to generate the response. */
	queryCount: number;
	/** A request id assigned by the server. */
	request_id: string;
	/** The total number of results for this request. */
	resultsCount: number;
	/** The status of this request's response. */
	status: string;
	/** For big requests, might get only partial response */
	next_url?: string;
	/** the API docs do not specify what exactly this is. 🙂 */
	count?: number;
};

export type OHLC = {
	/** Ticker symbol */
	T: string;
	/** Unix ms timestamp for the start of the aggregate window */
	t: number;
	/** Close price */
	c: number;
	/** High price */
	h: number;
	/** Low price */
	l: number;
	/** Open price */
	o: number;
};

export interface OHLCV extends OHLC {
	/** Volume */
	v: number;
}

/**
 * Response type of the "Grouped Daily" endpoint, and probably of others as well. *
 */
export interface OHLCVResult extends OHLCV {
	/** Number of transactions in the aggregate window */
	n?: number;
	/** Whether it's an OTC ticker */
	otc?: boolean;
	/** VWAP */
	vw?: number;
}

/** Response type of the "Daily Open/Close" endpoint. */
export type OpenClose = {
	afterHours?: number;
	close: number;
	from: string;
	high: number;
	low: number;
	open: number;
	otc?: boolean;
	preMarket?: number;
	status: string;
	symbol: string;
	volume: number;
};

/** Result from the "Aggregates (Bars) endpoint. */
export type AggregateResult = Omit<OHLCVResult, "T">;

/** Complete response from the Grouped Daily endpoint. */
export type GroupedDailyResponse = ResponseBase & {
	results: OHLCVResult[];
};

/** Complete respnse from the Aggregates (Bars) endpoint. */
export type AggregateResponse = ResponseBase & {
	results: AggregateResult[];
};

export type PolygonTimespan =
	| "second"
	| "minute"
	| "hour"
	| "day"
	| "week"
	| "month"
	| "quarter"
	| "year";

export type AggregateOptions = {
	ticker: Ticker;
	from: YearMonthDay;
	to: YearMonthDay;
	multiplier?: number;
	timespan?: PolygonTimespan;
};
