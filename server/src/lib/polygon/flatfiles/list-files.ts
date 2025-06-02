/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { FOLDERS } from "@/lib/polygon/flatfiles/constants";
import { flatFilesDailyAggsStore } from "@/lib/polygon/flatfiles/daily-aggs.store";
import {
	parseDailyAggsFilename,
	yearMonthDayToString,
} from "@/lib/polygon/flatfiles/queue/parse-filename";
import dayjs from "dayjs";
import fs from "fs/promises";

/** Lists (recursively) all (compressed and uncompressed) csv files in
 * `[/dash]/flatfiles/<folder>`.
 * @returns a list of strings like `2024/09/2024-09-01.csv.gz`. */
export async function listFlatFiles(folder: `${FOLDERS}`) {
	const path = `/dash/flatfiles/${folder}`;
	const files = await fs.readdir(path, { recursive: true });
	return files.filter((file) => file.endsWith(".csv") || file.endsWith(".csv.gz"));
}

/**
 * For a given folder, list all files that _are downloaded_, but have not been
 * parsed yet (i.e. are not smembers in the store yet).
 *
 * @note my initial flatfiles implementation doesn't have a mechanism to get,
 * parse, insert, cache the flatfiles, so there is no mechanism yet to ensure
 * that the data is up-to-date. This function is a first step in that direction.
 *
 * @todo test this function */
export async function listMissingAvailableFlatFiles(folder: `${FOLDERS}`) {
	const files = (await listFlatFiles(folder)).map((file) =>
		yearMonthDayToString(parseDailyAggsFilename(file)),
	);
	const storedFiles = new Set(await flatFilesDailyAggsStore.list());
	const missingFiles = files.filter((file) => !storedFiles.has(file));
	const fiveYearsAgo = dayjs().subtract(5, "year").add(1, "day");
	return missingFiles.filter((file) => dayjs(file, "YYYY-MM-DD").isAfter(fiveYearsAgo));
}
