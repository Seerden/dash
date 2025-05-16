import { QUEUES } from "@/lib/polygon/flatfiles/queue/constants";
import { redisClient } from "@/lib/redis-client";
import type { Job } from "bullmq";
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

// TODO: actually type this. I guess we can use PriceActionJobOptions though
type JobOptions = Job<object>;

/** Go over all failed jobs. Remove that have been processed in the meantime and
 * requeue those that haven't. */
async function requeueFailedJobs() {
	const failedJobs: JobOptions[] = [];

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

/** Worker for `flatfiles` minute aggregation processing.
 * @note the difference between this and the daily aggs worker is that this one
 * does not autorun.
 * @note Each node process can run a single worker, so to run multiple ones, run
 * it inside a child process (e.g. through runClusteredTasks, which is called in
 * `index.ts`).
 */
const worker = new Worker(
	queue.name,
	async (opts: JobOptions) => {
		// do the thing
	},
	{
		connection: redisClient,
		concurrency: 30,
		autorun: false,
	},
);

/** Interact with the minute aggs queue through this object.
 * @TODO do we need more functions in here?
 */
export const minuteAggsQueue = {
	__queue: queue,
	getJobs,
	requeueFailedJobs,
	startWorker: async () => {
		return await worker.run();
	},
};
