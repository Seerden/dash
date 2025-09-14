import PriceActionTable from "@/components/price-action/PriceActionTable/PriceActionTable";
import { trpc } from "@/lib/trpc";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import { createLazyFileRoute } from "@tanstack/react-router";

// TODO: search param (YearMonthDay) for the date. Default it to the latest
// market session.
export const Route = createLazyFileRoute("/price-action/daily-recap")({
	component: DailyRecap
});

// TODO: this is just a placeholder for the daily recap view
function DailyRecap() {
	const { data: priceActionData } = trpc.priceAction.daily.flat.useQuery({
		from: "2025-01-22",
		to: "2025-01-23",
		table: PRICE_ACTION_TABLES.DAILY,
		minVolume: 1e7
	});

	const { data: groupedPriceActionData } = trpc.priceAction.daily.grouped.useQuery({
		from: "2025-01-22",
		to: "2025-01-23",
		table: PRICE_ACTION_TABLES.DAILY,
		minVolume: 1e7,
		groupBy: "ticker"
	});

	console.log({ groupedPriceActionData });

	if (!priceActionData) {
		return null;
	}

	return <PriceActionTable data={priceActionData} />;
}
