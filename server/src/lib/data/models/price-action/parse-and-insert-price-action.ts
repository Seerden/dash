import { sqlConnection } from "@/db/init";
import { insertPriceAction } from "@/lib/data/models/price-action/insert-price-action";
import { parseGroupedDailyToPriceAction } from "@/lib/data/models/price-action/parse-polygon";
import { fetchGroupedDaily } from "@/lib/polygon/endpoints/grouped-daily";
import type { YearMonthDay } from "@shared/types/date.types";
import type { PriceAction } from "@shared/types/price-action.types";
import type { QueryFunction } from "types/utility.types";
import { fileURLToPath } from "url";

/** This is really just here to test the functionality. It's missing job
 * scheduling, caching etc.
 * @deprecated for now, we're only using historical data from the bucket,
 * instead of the API.
 */
export const fetchParseAndInsertGroupedDaily: QueryFunction<
	{ date: YearMonthDay },
	PriceAction[]
> = async ({ sql = sqlConnection, date }) => {
	const data = await fetchGroupedDaily(date);
	const parsedData = parseGroupedDailyToPriceAction(data);

	// instead of inserting, create a .json file with the parsed data, using the
	// date as the filename
	const fs = await import("fs/promises");
	await fs.mkdir(new URL(`./parsed-data`, import.meta.url), { recursive: true });
	const path = fileURLToPath(new URL(`./parsed-data/${date}.json`, import.meta.url));
	await fs.writeFile(path, JSON.stringify(parsedData, null, 0), {});

	const priceAction = await insertPriceAction({ sql, priceAction: parsedData });
	return priceAction;
};

/** Removes a file from the `parsed-data` directory.
 * @note this one is tested by the test for `parseAndInsertPriceAction`. */
export async function removeParsedDataFile(date: YearMonthDay) {
	const fs = await import("fs/promises");
	const path = fileURLToPath(new URL(`./parsed-data/${date}.json`, import.meta.url));
	await fs.rm(path);
}
