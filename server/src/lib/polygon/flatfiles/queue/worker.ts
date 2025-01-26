import { QUEUES } from "@/lib/polygon/flatfiles/queue/constants";
import { dailyAggsProcessingHandler } from "@/lib/polygon/flatfiles/queue/handler";
import type { PriceActionJob } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";
import { redisClient } from "@/lib/redis-client";
import { Worker } from "bullmq";

export function createPriceActionWorker() {
	const worker = new Worker(
		QUEUES.DAILY_AGGS_PROCESSING,
		async (job: PriceActionJob) => dailyAggsProcessingHandler(job),
		// I successfully ran this with concurrency 5, but 30 should be fine, too.
		// Just make sure not to exceed the database's max. connection count.
		{ connection: redisClient, concurrency: 30 },
	);

	// the handler function also logs this, so one of the logs is redudant
	// worker.on("completed", (job: PriceActionJob) => {
	// 	console.log(`job ${job.id} completed`);
	// });

	// worker.on("ready", async () => {
	//    // could do something here
	// });

	return worker;
}
