export async function runAtStartup() {
	// const data = await fetchGroupedDaily("2023-09-01");
	// console.log({ resultsCount: data?.resultsCount });
	// // put data in a new json file at ./data.json:
	// const fs = await import("fs/promises");
	// await fs.writeFile("./data.json", JSON.stringify(data, null, 2));
	// const aggregateData = await fetchAggregate({
	// 	from: "2025-01-17",
	// 	ticker: "MSFT",
	// 	to: "2025-01-20",
	// });
	// console.log({ aggregateData });
	// await fs.writeFile("./aggregateData.json", JSON.stringify(aggregateData,
	// null, 2));
	// console.time("insertPriceAction");
	// const rows = mockManyPriceActionRows().slice(10);
	// console.log({ rows });
	// await sqlConnection.begin(async (sql) => {
	// 	const inserted = await insertPriceAction({
	// 		sql,
	// 		priceAction: rows,
	// 	});
	// 	console.log({ inserted });
	// 	await sql`rollback`;
	// });
	// console.timeEnd("insertPriceAction");
}
