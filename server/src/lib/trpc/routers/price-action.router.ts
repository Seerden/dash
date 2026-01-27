import {
	flatDailyPriceActionResolver,
	groupedDailyPriceActionResolver,
} from "@/lib/trpc/resolvers/price-action/daily.resolver";
import { t } from "@/lib/trpc/trpc-context";

export const priceActionRouter = t.router({
	flatDailyPriceAction: flatDailyPriceActionResolver,
	groupedDailyPriceAction: groupedDailyPriceActionResolver,
});
