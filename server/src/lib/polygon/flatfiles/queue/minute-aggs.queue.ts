import { QUEUES } from "@/lib/polygon/flatfiles/queue/constants";
import type { PriceActionJob } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";
import { redisClient } from "@/lib/redis-client";
import { Queue, Worker } from "bullmq";

/** In contrast to how I handled the daily aggregation, I'm keeping all the
 * functionality for the minute aggregation in a single file. See how it feels:
 * is it easier to parse the intent of the code, or harder? */

const queue = new Queue(QUEUES.MINUTE_AGGS_PROCESSING, {
	connection: redisClient,
	telemetry: undefined,
});

/** Collection of functions related to listing jobs. */
const getJobs = {
	counts: async () => await queue.getJobCounts(),
	waiting: async () => await queue.getWaiting(),
	failed: async () => await queue.getFailed(),
	all: async () => await queue.getJobs(),
	one: async (jobId: string) => await queue.getJob(jobId),
};

/** Go over all failed jobs. Remove that have been processed in the meantime and
 * requeue those that haven't. */
async function requeueFailedJobs() {
	const failedJobs: PriceActionJob[] = [];

	for (const job of failedJobs) {
		const isAlreadyProcessed = false; // TODO: check if these options are already processed

		if (isAlreadyProcessed) {
			// do something?
			await job.remove();
		} else {
			await queue.add(job.name, job.data, job.opts);
		}
	}
}

/** Worker for `flatfiles` minute aggregation processing. */
const worker = new Worker(
	queue.name,
	async (opts: PriceActionJob) => {
		// TODO: minute aggs version of dailyAggsProccesingHandler
	},
	{
		connection: redisClient,
		concurrency: 30,
	},
);
