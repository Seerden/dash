import type { BulkJobOptions } from "bullmq";

export enum JOB_NAMES {
	DAILY_AGGS = "processPriceAction",
	MINUTE_AGGS = "processMinutePriceAction",
}

export enum QUEUES {
	DAILY_AGGS_PROCESSING = "priceActionProcessingQueue",
	MINUTE_AGGS_PROCESSING = "minuteAggsProcessingQueue",
}

export const defaultBulkJobOptions: BulkJobOptions = {
	removeOnComplete: true,
	removeOnFail: false,
};
