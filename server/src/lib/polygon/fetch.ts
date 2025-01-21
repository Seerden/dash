import type { ResponseBase } from "@/lib/polygon/polygon.types";
import { POLYGON_API_KEY, polygonBaseUrl } from "./constants";

type FetchPolygonBaseArgs =
	| {
			/** The polygon endpoint to fetch from (part of the url after after
			 * `polygon.io/`). */
			endpoint: string;
			/** If the previous request returned a nextUrl, we can fetch that instead. */
			nextUrl?: undefined;
	  }
	| {
			/** The polygon endpoint to fetch from (part of the url after after
			 * `polygon.io/`). */
			endpoint?: undefined;
			/** If the previous request returned a nextUrl, we can fetch that instead. */
			nextUrl: string;
	  };

type FetchPolygonArgs = FetchPolygonBaseArgs & {
	/** Additional parameters to include in the request -- not every param will
	 * be available to every request
	 * @todo check if polygon throws errors if we specify invalid params */
	params?: Record<string, string | number | boolean>;
};

/** Pre-sets baseUrl and headers for Polygon API requests, or makes the request
 * to nextUrl. */
export async function fetchPolygon<U>({ endpoint, nextUrl, params }: FetchPolygonArgs) {
	const url = nextUrl ?? new URL(`${polygonBaseUrl}/${endpoint}`);
	if (!nextUrl) {
		const searchParams = new URLSearchParams({
			adjusted: "true",
			apiKey: POLYGON_API_KEY,
			...params,
		});
		url.search = searchParams.toString();
	}

	try {
		const response = await fetch(url, {
			headers: new Headers({
				Authorization: `Bearer ${POLYGON_API_KEY}`,
			}),
		});

		const data = (await response.json()) as ResponseBase & { results: U[] };

		if (data.status === "ERROR")
			throw new Error(`Polygon returned an error: ${JSON.stringify(data)}`);

		if (data.results === undefined)
			throw new Error(
				`"results" is undefined. This probably means that there is no data (yet) for this date.`,
			);
		if (!data.results.length)
			throw new Error(`Polygon returned no results: ${JSON.stringify(data)}`);

		if (!data) throw new Error(`Polygon returned no data: ${JSON.stringify(response)}`);

		return data;
	} catch (e) {
		console.error(`Error fetching from Polygon: ${e}`);
		// TODO: persistent error logging (Sentry)
	}
}
