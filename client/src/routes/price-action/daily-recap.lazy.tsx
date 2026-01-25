import { trpc } from "@/lib/trpc";
import type { PriceActionWithUpdatedAt } from "@shared/types/price-action.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

function roundVolumeToMillions(volume: number) {
	return (volume / 1e6).toFixed(2);
}

// TODO: search param (YearMonthDay) for the date. Default it to the latest
// market session.
export const Route = createLazyFileRoute("/price-action/daily-recap")({
	component: DailyRecap
});

// TODO: this is just a placeholder for the daily recap view
function DailyRecap() {
	const { data: priceActionData } = useQuery(trpc.priceAction.daily.flat.queryOptions({
		from: "2025-01-22",
		to: "2025-01-23",
		table: PRICE_ACTION_TABLES.DAILY,
		minVolume: 1e7
	}))

	const { data: groupedPriceActionData } = useQuery(trpc.priceAction.daily.grouped.queryOptions({
		from: "2025-01-22",
		to: "2025-01-23",
		table: PRICE_ACTION_TABLES.DAILY,
		minVolume: 1e7,
		groupBy: "ticker"
	}));

	console.log({ groupedPriceActionData });

	if (!priceActionData) {
		return null;
	}

	return (
		<div>
			<div
				style={{
					margin: "1.5rem",
					display: "grid",
					rowGap: "0.5rem",
					gridTemplateColumns: "repeat(6, max-content)"
				}}
			>
				{(priceActionData as PriceActionWithUpdatedAt[]).map(
					(d: PriceActionWithUpdatedAt) => (
						<div
							key={d.ticker}
							style={{
								display: "grid",
								gap: "0.5rem",
								gridTemplateColumns: "subgrid",
								gridColumn: "1 / -1"
							}}
						>
							<div>{d.ticker}</div>
							<div>{d.open}</div>
							<div>{d.close}</div>
							<div>{d.high}</div>
							<div>{d.low}</div>
							<div>{roundVolumeToMillions(+d.volume)}</div>
						</div>
					)
				)}
			</div>
		</div>
	);
}
