import type { PriceAction } from "types/price-action.types";

function mockPriceAction(index: number): PriceAction {
	return {
		close: 2,
		open: 1,
		high: 3,
		low: 0.5,
		volume: 10,
		ticker: "MSFT",
		timestamp: index,
	};
}

export const mockManyPriceActionRows = (size = 1e4) =>
	Array.from({ length: size }, (_, i) => mockPriceAction(i));
