import { writeFile } from "fs/promises";

const initialEquity = 27000;

function equityN() {
	const equityLevels = [[0, initialEquity, 100]];
	for (const n in Array.from({ length: 600 }).map((_, i) => i + 1)) {
		const previousDayEquity = equityLevels.at(-1)?.[1] as number;
		const roomToRuin = previousDayEquity - 25000;
		const r = Math.min(roomToRuin / 50, 25000); // 50 trades to ruin
		const nextEquity = previousDayEquity + (r * 10.55) / 11;
		equityLevels.push([+n, nextEquity, r]);
	}

	return equityLevels;
}

try {
	const equity = equityN();

	// write map to csv, where each entry is {day, equity}

	const csvContent = equity
		.map(([day, eq, r]) => `${day},${eq},${eq - initialEquity},${r}`)
		.join("\n");
	await writeFile("equity.csv", "day,equity,profit,r\n" + csvContent);
} catch (error) {
	console.error(error);
}
