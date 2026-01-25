import {
	generateMarketDateRange,
	lastCompleteMarketSession,
	maxPolygonLookback,
} from "@shared/lib/datetime/market-time";
import { z } from "zod";
import { flatFilesDailyAggsStore } from "@/lib/polygon/flatfiles/daily-aggs.store";
import { flatFilesMinuteAggsStore } from "@/lib/polygon/flatfiles/minute-aggs.store";
import { authenticatedProcedure } from "@/lib/trpc/procedures/authenticated.procedure";

const flatfilesFolderStatusSchema = z.object({
	missing: z.set(z.string()),
});

const flatfilesStatusSchema = z.object({
	daily: flatfilesFolderStatusSchema,
	minute: flatfilesFolderStatusSchema,
});

export const flatFilesStatusResolver = authenticatedProcedure
	.output(flatfilesStatusSchema)
	.query(async () => {
		const storedDailyPriceAction = new Set(
			await flatFilesDailyAggsStore.list()
		);
		const storedMinutePriceAction = new Set(
			await flatFilesMinuteAggsStore.list()
		);

		const marketDatesInPolygonLookbackRange = new Set(
			generateMarketDateRange({
				from: maxPolygonLookback(),
				to: lastCompleteMarketSession(),
			})
		);

		const missingDaily = new Set<string>();
		const missingMinute = new Set<string>();
		for (const marketDate of marketDatesInPolygonLookbackRange) {
			if (!storedDailyPriceAction.has(marketDate)) {
				missingDaily.add(marketDate);
			}
			if (!storedMinutePriceAction.has(marketDate)) {
				missingMinute.add(marketDate);
			}
		}

		const status = {
			daily: {
				missing: missingDaily,
			},
			minute: {
				missing: missingMinute,
			},
		};

		return status;
	});
