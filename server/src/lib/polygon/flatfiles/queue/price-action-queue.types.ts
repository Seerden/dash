import type { Job } from "bullmq";
import type { YearMonthDay } from "types/data.types";

export type PriceActionJobOptions = {
	/** should be a `YearMonthDay` string. */
	filename: YearMonthDay;
};

export type PriceActionJob = Job<PriceActionJobOptions>;
