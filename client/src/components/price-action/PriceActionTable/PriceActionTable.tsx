import { volumeInMillions } from "@/components/price-action/PriceActionTable/volume";
import type { PriceActionWithUpdatedAt } from "@shared/types/price-action.types";
import S from "./PriceActionTable.style";

type PriceActionTableProps = {
	data: PriceActionWithUpdatedAt[];
	filter?: null; // not yet implemented
};

const columns = ["Ticker", "Open", "Close", "High", "Low", "Volume (millions)"];

// make sure the order matches columns (todo: put them in a Map)
const fields: (keyof PriceActionWithUpdatedAt)[] = [
	"ticker",
	"open",
	"close",
	"high",
	"low",
	"volume"
];

export default function PriceActionTable({ data }: PriceActionTableProps) {
	if (!data.length) {
		return null;
	}

	return (
		<S.TableWrapper columns={Object.keys(data[0]).length}>
			{/* sticky header goes here */}
			<S.TableHeader>
				{columns.map((column) => (
					<S.Cell key={column}>
						<S.InnerCell>{column}</S.InnerCell>
					</S.Cell>
				))}
			</S.TableHeader>

			{/* rows go here */}
			{data.map((d: PriceActionWithUpdatedAt) => (
				<S.TableRow key={d.ticker}>
					{fields
						.filter((f) => f !== "volume")
						.map((field) => (
							<S.Cell key={field}>
								<S.InnerCell key={field}>{d[field] as string}</S.InnerCell>
							</S.Cell>
						))}
					<S.Cell>
						<S.InnerCell>{volumeInMillions(+d.volume)}</S.InnerCell>
					</S.Cell>
				</S.TableRow>
			))}
		</S.TableWrapper>
	);
}
