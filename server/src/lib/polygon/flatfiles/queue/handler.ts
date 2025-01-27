import { flatFilesDailyAggsStore } from "@/lib/polygon/flatfiles/daily-aggs.store";
import { insertDailyAggsFromCsv } from "@/lib/polygon/flatfiles/insert-from-csv";
import { parseDailyAggsJobFilenameToCsvFilename } from "@/lib/polygon/flatfiles/queue/parse-filename";
import type { PriceActionJobOptions } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";
import type { Job } from "bullmq";

/** This handler is passed to the daily_aggs worker(s). It inserts the data
 * from the specified csv file into the database, and adds the date to the
 * store. */
export async function dailyAggsProcessingHandler(job: Job<PriceActionJobOptions>) {
	try {
		if (await flatFilesDailyAggsStore.check(job.data.filename)) {
			return console.log(`file ${job.data.filename} has already been processed`);
		}

		console.log(`file ${job.data.filename} being processed by job ${job.id}`);

		await insertDailyAggsFromCsv({
			filename: parseDailyAggsJobFilenameToCsvFilename(job.data.filename),
		});

		await flatFilesDailyAggsStore.add(job.data.filename);

		console.log(`job ${job.id} processed ${job.data.filename}`);
	} catch (error) {
		throw new Error(`job ${job.id} failed to process file ${job.data.filename}`);
	}
}
