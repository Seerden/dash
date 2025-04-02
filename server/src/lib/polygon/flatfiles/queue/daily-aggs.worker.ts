import { dailyAggsQueue } from "@/lib/polygon/flatfiles/queue/daily-aggs.queue";
import { dailyAggsProcessingHandler } from "@/lib/polygon/flatfiles/queue/handler";
import type { PriceActionJob } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";
import { redisClient } from "@/lib/redis-client";
import { Worker } from "bullmq";

export function createDailyAggsPriceActionWorker() {
	const worker = new Worker(
		dailyAggsQueue.__queue.name,
		async (job: PriceActionJob) => {
			return dailyAggsProcessingHandler(job);
		},
		// I successfully ran this with concurrency 5, but 30 should be fine, too.
		// Just make sure not to exceed the database's max. connection count.
		{
			connection: redisClient,
			concurrency: 30,
			// telemetry: undefined,
			// prefix: "bull",
		},
	);

	return worker;
}
