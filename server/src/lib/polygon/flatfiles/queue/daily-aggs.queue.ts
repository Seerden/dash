import { flatFilesDailyAggsStore } from "@/lib/polygon/flatfiles/daily-aggs.store";
import { QUEUES } from "@/lib/polygon/flatfiles/queue/constants";
import { bulkAddDailyAggsJobs } from "@/lib/polygon/flatfiles/queue/jobs";
import type { PriceActionJobOptions } from "@/lib/polygon/flatfiles/queue/price-action-queue.types";
import { redisClient } from "@/lib/redis-client";
import type { Job } from "bullmq";
import { Queue } from "bullmq";

const dailyAggsProcessingQueue = new Queue(QUEUES.DAILY_AGGS_PROCESSING, {
	connection: redisClient,
});

async function getJobCounts() {
	return await dailyAggsProcessingQueue.getJobCounts();
}

async function getWaitingJobs() {
	const waitingJobs: Job[] = await dailyAggsProcessingQueue.getWaiting();
	return waitingJobs;
}

async function getFailedJobs() {
	const failedJobs: Job[] = await dailyAggsProcessingQueue.getFailed();
	return failedJobs;
}

async function getJob(jobId: string): Promise<Job<PriceActionJobOptions> | null> {
	return await dailyAggsProcessingQueue.getJob(jobId);
}

async function getJobs() {
	const jobs = await dailyAggsProcessingQueue.getJobs();
	return jobs;
}

async function requeueFailedJobs() {
	const failedJobs: Job<PriceActionJobOptions>[] =
		await dailyAggsProcessingQueue.getFailed();
	const processedFiles = await flatFilesDailyAggsStore.list();
	for (const job of failedJobs) {
		const isAlreadyProcesssed = processedFiles.includes(job.data.filename);
		if (isAlreadyProcesssed) {
			console.log(
				`skipping failed job ${job.id} because it has already been processed`,
			);
			await job.remove();
			continue;
		}
		console.log(`re-queueing failed job ${job.id}`);
		await bulkAddDailyAggsJobs(failedJobs.map((job) => job.data));
	}
}

export const dailyAggsQueue = {
	__queue: dailyAggsProcessingQueue,
	getJobCounts,
	getJobs,
	getWaitingJobs,
	getFailedJobs,
	getJob,
	requeueFailedJobs,
	addBulk: dailyAggsProcessingQueue.addBulk,
};
