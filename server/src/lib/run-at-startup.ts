import { setAwsCredentials } from "@/lib/polygon/flatfiles/bucket";
import { minuteAggsQueue } from "@/lib/polygon/flatfiles/queue/minute-aggs.queue";

export async function runAtStartup() {
	try {
		await setAwsCredentials();
	} catch (error) {
		console.error("Error setting AWS credentials", error);
	}

	await dev();
}

async function dev() {
	// await getFiles({
	// 	folder: "minute_aggs_v1",
	// 	year: "2025",
	// 	month: "05",
	// });
	// await DEV_addTestMinuteAggsJob();
}

export async function runClusteredTasks() {
	// const _worker = createDailyAggsPriceActionWorker();
	// return _worker;
	await minuteAggsQueue.startWorker();
}
