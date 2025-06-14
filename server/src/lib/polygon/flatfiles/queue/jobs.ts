import { flatFilesDailyAggsStore } from "@/lib/polygon/flatfiles/daily-aggs.store";
import { listFlatFiles } from "@/lib/polygon/flatfiles/list-files";
import {
	defaultBulkJobOptions,
	JOB_NAMES,
} from "@/lib/polygon/flatfiles/queue/constants";
import { dailyAggsQueue } from "@/lib/polygon/flatfiles/queue/daily-aggs.queue";
import {
	aggsFilenameToYMD,
	yearMonthDayToString,
} from "@/lib/polygon/flatfiles/queue/parse-filename";
import { type PriceActionJobOptions } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";

/** Given an array of job options, creates a new job for each of the job options
 * that corresponds to a not-yet-processed file.
 * @note the check for processed files is mostly a failsafe to prevent duplicate
 * jobs from ever entering the queue. */
export async function bulkAddDailyAggsJobs(jobs: PriceActionJobOptions[]) {
	const processedFiles = await flatFilesDailyAggsStore.list();

	// TODO DAS-48: these aren't equal to PriceActionJob[], so do we need to
	// create a  separate type to match the input for queue.addBulk()?
	const jobOptions = jobs
		.filter((job) => !processedFiles.includes(job.filename))
		.map((job) => ({
			name: JOB_NAMES.DAILY_AGGS,
			data: job,
			opts: defaultBulkJobOptions,
		}));

	await dailyAggsQueue.__queue.addBulk(jobOptions);
}

/** Create jobs for all unprocessed files in `[/dash]/flatfiles/day_aggs_v1/` */
export async function seedDayAggsJobs() {
	const files = await listFlatFiles("day_aggs_v1");
	const processedFiles = await flatFilesDailyAggsStore.list();
	const unprocessedFiles = files.filter((f) => !processedFiles.includes(f));

	await bulkAddDailyAggsJobs(
		unprocessedFiles.map((filename) => ({
			// have to parse each filename to `YearMonthDay`
			filename: yearMonthDayToString(aggsFilenameToYMD(filename)),
		})),
	);
}
