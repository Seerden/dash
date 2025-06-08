import { queryTimestamps } from "@/lib/data/models/price-action/query-price-action";
import {
	aggsFilenameToYMD,
	yearMonthDayToString,
} from "@/lib/polygon/flatfiles/queue/parse-filename";
import { ERRORS, priceActionStoreKeys } from "@/lib/polygon/flatfiles/store-constants";
import { redisClient } from "@/lib/redis-client";
import { formatToYearMonthDay } from "@shared/lib/datetime/timestamp";
import { isYearMonthDay } from "@shared/types/date.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";

/*
   TODO DAS-48: this file is basically a copy of minute-aggs.store.ts, but for minute
   aggs. Instead of duplicating the code, we can refactor a single store to take the
   store key as a parameter, then we can use the store for daily and minute
   aggs, without having to manually keep the two at parity.

   TODO: clean up usage of no-non-null-assertion by using type guards properly.
*/

const storeKey = priceActionStoreKeys.daily;

async function list() {
	return await redisClient.smembers(storeKey);
}

async function check(filename: string) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const yearMonthDay = filename.split("/").at(-1)!.split(".")[0];
	if (!isYearMonthDay(yearMonthDay)) {
		throw ERRORS.INVALID_FILENAME(filename);
	}

	const filepath = yearMonthDayToString(aggsFilenameToYMD(filename));
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
