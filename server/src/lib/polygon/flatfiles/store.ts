import { queryTimestamps } from "@/lib/data/models/price-action/query-price-action";
import { formatToYearMonthDate } from "@/lib/datetime/timestamp";
import {
	parseDailyAggsFilename,
	yearMonthDayToString,
} from "@/lib/polygon/flatfiles/queue/parse-filename";
import { redisClient } from "@/lib/redis-client";
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

async function synchronize() {
	// get all the unique timestamps from the database
	const dateStrings = (await queryTimestamps({})).map((ts) =>
		formatToYearMonthDate(new Date(ts.unix)),
	);
	// add each year-month-day to the store
	for (const dateString of dateStrings) {
		await add(dateString);
	}
}

export const flatfilesStore = {
	__key: storeKey,
	list,
	check,
	add,
	remove,
	clear,
	synchronize,
};
