import { setAwsCredentials } from "@/lib/polygon/flatfiles/bucket";

export async function runAtStartup() {
	try {
		await setAwsCredentials();
	} catch (error) {
		console.error("Error setting AWS credentials", error);
	}

	await dev();
}

async function dev() {}

export async function runClusteredTasks() {
	// const _worker = createDailyAggsPriceActionWorker();
	// return _worker;
}
