import { setAwsCredentials } from "@/lib/polygon/flatfiles/bucket";

export async function runAtStartup() {
	await setAwsCredentials();
	// try {
	// 	const d = await setAwsCredentials();
	// 	// const b = await listS3Objects();
	// 	const b = await listFileContents();
	// 	console.log({ b });
	// } catch (error) {
	// 	console.error(error);
	// }
	// const content = await readFile("2025-01-03.csv.gz");
	// const data = gunzipSync(content);
	// await writeFile("2025-01-03.csv", data);
	// await getColumnsAndFirstRow("2025-01-03.csv");
	// TEST: insert from test gzipped file
	// try {
	// 	console.time("insertFromCsv");
	// 	const count = await insertFromCsv({
	// 		filename: "test.csv.gz",
	// 		tableName: "test",
	// 	});
	// 	console.timeEnd("insertFromCsv");
	// 	console.log({ count, bool: 1 });
	// } catch (error) {
	// 	console.error(error);
	// }
	// try {
	// 	console.time("listS3Objects");
	// 	const files = await listS3Objects();
	// 	console.timeEnd("listS3Objects");
	// 	console.log({ files });
	// } catch (error) {
	// 	console.error(error);
	// }
	// await storeS3Objects();

	// try {
	// 	for (const year of ["2021", "2022", "2023", "2024", "2025"]) {
	// 		console.log("Downloading day_aggs_v1 files for year", year);
	// 		await getFiles({
	// 			folder: "day_aggs_v1",
	// 			year,
	// 		});
	// 		console.log("Downloaded day_aggs_v1 files for year", year);
	// 	}
	// } catch (error) {
	// 	console.log({ error });
	// }
}
