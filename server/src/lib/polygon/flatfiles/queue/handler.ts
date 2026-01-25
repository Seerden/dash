import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { Job } from "bullmq";
import { FOLDERS } from "@/lib/polygon/flatfiles/constants";
import { flatFilesDailyAggsStore } from "@/lib/polygon/flatfiles/daily-aggs.store";
import { insertAggsFromCsv } from "@/lib/polygon/flatfiles/insert-from-csv";
import { flatFilesMinuteAggsStore } from "@/lib/polygon/flatfiles/minute-aggs.store";
import { parseAggsJobFilenameToCsvFilename } from "@/lib/polygon/flatfiles/queue/parse-filename";
import type { PriceActionJobOptions } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";

/** This handler is passed to the daily_aggs worker(s). It inserts the data
 * from the specified csv file into the database, and adds the date to the
 * store. */
export async function dailyAggsProcessingHandler(
	job: Job<PriceActionJobOptions>
) {
	try {
		if (await flatFilesDailyAggsStore.check(job.data.filename)) {
			return console.log(
				`file ${job.data.filename} has already been processed`
			);
		}

		console.log(`file ${job.data.filename} being processed by job ${job.id}`);

		await insertAggsFromCsv({
			filename: parseAggsJobFilenameToCsvFilename({
				filename: job.data.filename,
				folder: `${FOLDERS.DAY_AGGS}`,
			}),
			targetTable: PRICE_ACTION_TABLES.DAILY,
		});

		await flatFilesDailyAggsStore.add(job.data.filename);

		console.log(`job ${job.id} processed ${job.data.filename}`);
	} catch (_error) {
		throw new Error(
			`job ${job.id} failed to process file ${job.data.filename}`
		);
	}
}

/** This handler is passed to the minute aggs worker(s). It inserts the data
 * from the specified csv file into the database, and adds the date to the
 * store.
 * @todo finalize logic; can we simply rename
 * parseDailyAggsJobFilenameToCsvFilename to generic, or does the filename
 * actually need to be different? (in the latter case we need a new helper) */
export async function minuteAggsProcessingHandler(
	job: Job<PriceActionJobOptions>
) {
	try {
		if (await flatFilesMinuteAggsStore.check(job.data.filename)) {
			return console.log(
				`file ${job.data.filename} has already been processed`
			);
		}

		console.log(`file ${job.data.filename} being processed by job ${job.id}`);

		await insertAggsFromCsv({
			// TODO: use filename parser for minute aggs instead of daily aggs
			filename: parseAggsJobFilenameToCsvFilename({
				filename: job.data.filename,
				folder: `${FOLDERS.MINUTE_AGGS}`,
			}),
			targetTable: PRICE_ACTION_TABLES.MINUTE,
		});

		await flatFilesMinuteAggsStore.add(job.data.filename);

		console.log(`job ${job.id} processed ${job.data.filename}`);
	} catch (error) {
		throw new Error(
			`job ${job.id} failed to process file ${job.data.filename}`
		);
	}
}
