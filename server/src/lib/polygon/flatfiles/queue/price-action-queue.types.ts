import type { YearMonthDay } from "@shared/types/date.types";
import type { Job } from "bullmq";

export type PriceActionJobOptions = {
	/** should be a `YearMonthDay` string. */
	filename: YearMonthDay;
};

export type PriceActionJob = Job<PriceActionJobOptions>;
