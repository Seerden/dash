import { fetchPolygon } from "@/lib/polygon/fetch";
import type { AggregateOptions, AggregateResult } from "@/lib/polygon/polygon.types";

function getAggregateUrl(options: AggregateOptions) {
	// NOTE: 50000 is specified as the maximum limit in the polygon documentation as of 14 oct 2023
	const DEFAULT_LIMIT = 50_000;
	return `v2/aggs/ticker/${options.ticker}/range/${options.multiplier}/${options.timespan}/${options.from}/${options.to}?limit=${DEFAULT_LIMIT}`;
}

/** Fetch aggregate bars for a ticker. This may result in multiple requests
 * being made, because of the way Polygon limits itself to 50k rows per
 * response.
 * @see https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
 * @note in dash-old, this function returned a single results array, but here,
 * we're returning the entire array of response objects, and we'll iterate over
 * it elsewhere.
 */
export async function fetchAggregate({
	ticker,
	from,
	to,
	multiplier = 1,
	timespan = "minute",
}: AggregateOptions) {
	const options = { ticker, from, to, multiplier, timespan };
	const endpoint = getAggregateUrl(options);

	let response = await fetchPolygon<AggregateResult>({ endpoint });
	if (!response) return;
	const data: Array<typeof response> = [response];

	while (response.next_url) {
		try {
			response = await fetchPolygon<AggregateResult>({ nextUrl: response.next_url });

			if (!response) break;
			data.push(response);
		} catch (error) {
			console.log("Polygon returned error", { error }); // TODO: we probably want to persistently log this somewhere
			break;
		}
	}

	return data;
}

// TODO: fetching data for a non-market date or a date for which data isn't
// available yet will probably throw an error. make sure that caller handles
// that.
