/** biome-ignore-all lint/style/noNonNullAssertion: map entries exist */

// TODO: WIP
// export async function pnl(filename: string) {
// 	// read a tickets-<filename>.csv and parse to trades
// 	const content = await readFile(`./json/${filename}.json`, "utf-8");
// 	const trades = JSON.parse(content) as TradeZeroTicket[];

// 	const realizedNet = trades.reduce((acc, trade) => {
// 		return acc + trade.netProceeds;
// 	}, 0);

// 	const realizedGross = trades.reduce((acc, trade) => {
// 		return acc + trade.grossProceeds;
// 	}, 0);

// 	return { realizedNet, realizedGross };
// }

// async function size(filename: string) {
// 	// read a tickets- csv and parse to trades
// 	const content = await readFile(`./json/${filename}.json`, "utf-8");
// 	const trades = JSON.parse(content) as TradeZeroTicket[];

// 	const totalEntrySize = trades.reduce((acc, trade) => {
// 		if (trade.side.includes("S")) {
// 			return acc + trade.quantity;
// 		}
// 		return acc;
// 	}, 0);

// 	const totalExitSize = trades.reduce((acc, trade) => {
// 		if (trade.side.includes("B")) {
// 			return acc + trade.quantity;
// 		}
// 		return acc;
// 	}, 0);

// 	return { totalEntrySize, totalExitSize };
// }

// async function commission(filename: string) {
// 	// read a tickets- csv and parse to trades
// 	const content = await readFile(`./json/${filename}.json`, "utf-8");
// 	const trades = JSON.parse(content) as TradeZeroTicket[];

// 	const commission = trades.reduce((acc, trade) => {
// 		return acc + trade.commission;
// 	}, 0);

// 	return { commission };
// }

// try {
// 	const files = (await readdir("./json")).map((f) => f.replace(".json", ""));
// 	for (const file of files) {
// 		const totalSize = await size(file);
// 		const simulatedCommission =
// 			(totalSize.totalEntrySize + totalSize.totalExitSize) * 0.0015;
// 		console.log({
// 			file,
// 			...(await pnl(file)),
// 			size: totalSize,
// 			simulatedCommission,
// 			...(await commission(file)),
// 		});
// 	}
// } catch (error) {
// 	console.error(error);
// }

// type TradesJson = Map<
// 	string,
// 	{ currentSize: number; trades: TradeZeroTicket[][] }
// >;

// async function _trades(): Promise<TradesJson> {
// 	const files = (await readdir("./json")).map((f) => f.replace(".json", ""));

// 	const tickets: TradeZeroTicket[] = [];

// 	for (const file of files) {
// 		const content = await readFile(`./json/${file}.json`, "utf-8");
// 		const parsed = JSON.parse(content) as TradeZeroTicket[];
// 		tickets.push(...parsed);
// 	}

// 	const tradeMap = tickets.reduce((acc, ticket) => {
// 		const current = acc.get(ticket.symbol);
// 		if (!current) {
// 			acc.set(ticket.symbol, {
// 				currentSize: 0,
// 				trades: [],
// 			});
// 		}

// 		const initiateNewTrade = acc.get(ticket.symbol)!.currentSize === 0;
// 		if (initiateNewTrade) {
// 			acc.get(ticket.symbol)!.trades.push([]);
// 		}

// 		const nextSize =
// 			acc.get(ticket.symbol)!.currentSize +
// 			ticket.quantity * (ticket.side.includes("S") ? 1 : -1);
// 		acc.get(ticket.symbol)!.currentSize = nextSize;

// 		acc
// 			.get(ticket.symbol)!
// 			.trades[acc.get(ticket.symbol)!.trades.length - 1].push(ticket);

// 		return acc;
// 	}, new Map());

// 	await writeFile(
// 		"./meta/trades.json",
// 		JSON.stringify(Object.fromEntries(tradeMap), null, 2),
// 		"utf-8"
// 	);
// 	return tradeMap;
// }

// async function tradeRealized() {
// 	const json = await readFile("./meta/trades.json", "utf-8");
// 	const parsed = JSON.parse(json) as TradesJson;
// 	const realizedMap = new Map<string, number[]>();
// 	for (const [symbol, { trades }] of Object.entries(parsed)) {
// 		for (const trade of trades as TradeZeroTicket[][]) {
// 			const realized = trade.reduce((acc, t) => {
// 				return acc + t.netProceeds;
// 			}, 0);
// 			realizedMap.set(symbol, [
// 				...(realizedMap.get(symbol) ?? []),
// 				Math.round(realized * 100) / 100,
// 			]);
// 		}
// 	}

// 	return realizedMap;
// }

// async function winrate() {
// 	const json = await readFile("./meta/realized.json", "utf-8");
// 	const parsed = JSON.parse(json) as TradesJson;
// 	const realizedList = Object.values(parsed).flat();
// 	console.log({ realizedList });
// 	const winners = realizedList.filter((r) => r >= 0);
// 	const wl = winners.length / realizedList.length;
// 	return wl;
// }
