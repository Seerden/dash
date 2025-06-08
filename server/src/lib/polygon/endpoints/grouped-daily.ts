import { fetchPolygon } from "@/lib/polygon/fetch";
import type { OHLCVResult } from "@/lib/polygon/polygon.types";
import type { YearMonthDay } from "@shared/types/date.types";

function getGroupedDailyUrl(date: YearMonthDay) {
	return `v2/aggs/grouped/locale/us/market/stocks/${date}`;
}

/** Fetches from Polygon's "grouped daily (Bars)"" endpoint.
 * @see https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
 * @todo tests (DAS-36)
 */
export async function fetchGroupedDaily(date: YearMonthDay) {
	const data = await fetchPolygon<OHLCVResult>({
		endpoint: getGroupedDailyUrl(date),
		params: {
			include_otc: false,
		},
	});

	return data;
}
