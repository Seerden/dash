import { queryTimestamps } from "@/lib/data/models/price-action/query-price-action";
import { formatToYearMonthDay } from "@/lib/datetime/timestamp";
import {
	parseDailyAggsFilename,
	yearMonthDayToString,
} from "@/lib/polygon/flatfiles/queue/parse-filename";
import { redisClient } from "@/lib/redis-client";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import { isYearMonthDay } from "types/data.types";

const storeKey = "polygon:flatfiles:daily:parsed";

async function list() {
	return await redisClient.smembers(storeKey);
}

const ERRORS = {
	INVALID_FILENAME: (filename: string) =>
		new Error(
			`Invalid filename: ${filename}, flatFiles must be formatted like  '<year>-<month>-<day>.csv.gz'`,
		),
};

async function check(filename: string) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const yearMonthDay = filename.split("/").at(-1)!.split(".")[0];
	if (!isYearMonthDay(yearMonthDay)) {
		throw ERRORS.INVALID_FILENAME(filename);
	}

	const filepath = yearMonthDayToString(parseDailyAggsFilename(filename));
	return await redisClient.sismember(storeKey, filepath);
}

async function add(filename: string) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const yearMonthDay = filename.split("/").at(-1)!.split(".")[0];
	if (!isYearMonthDay(yearMonthDay)) {
		throw ERRORS.INVALID_FILENAME(filename);
	}

	await redisClient.sadd(storeKey, yearMonthDay);
}

async function remove(filename: string) {
	await redisClient.srem(storeKey, filename);
}

async function clear() {
	await redisClient.del(storeKey);
}

/** For all the unique timestamps that have data associated with them, adds the
 * corresponding date to the flatfiles store.
 * @todo also remove any dates that are in the store but don't have data in the
 * database. */
async function synchronize() {
	const dateStrings = (await queryTimestamps({ table: PRICE_ACTION_TABLES.DAILY })).map(
		(ts) => formatToYearMonthDay(new Date(ts.unix)),
	);

	for (const dateString of dateStrings) {
		await add(dateString);
	}
}

export const flatFilesDailyAggsStore = {
	__key: storeKey,
	list,
	check,
	add,
	remove,
	clear,
	synchronize,
};
