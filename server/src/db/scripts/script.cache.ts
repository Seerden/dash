import { sqlConnection } from "@/db/init";
import { redisClient } from "@/lib/redis-client";
import fs, { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const scriptCacheKeys = {
	database: {
		up: "script:db:prod:up",
	},
	testDatabase: {
		up: "script:db:test:up",
	},
};

/** Gets the redis cache key where we store the scripts. The key differs based
 * on whether or not we're in the test environment. */
function getScriptCacheKey() {
	const isTestEnv = process.env.IS_TEST_ENVIRONMENT === "true";
	return isTestEnv ? scriptCacheKeys.testDatabase.up : scriptCacheKeys.database.up;
}

/** Gets the list of script filenames that redis says were executed. */
async function listExecutedScripts() {
	return redisClient.smembers(getScriptCacheKey());
}

/** Checks if the script with the given filename is in the redis set. */
async function scriptHasBeenExecuted(filename: string) {
	const hasRun = await redisClient.sismember(getScriptCacheKey(), filename);
	return Boolean(hasRun);
}

/** Attempts to add the script with the given filename to the redis set. */
async function markScriptAsExecuted(filename: string) {
	await redisClient.sadd(getScriptCacheKey(), filename);
}

/** Opposite action to markScriptAsExecuted. */
async function markScriptAsNotExecuted(filename: string) {
	await redisClient.srem(getScriptCacheKey(), filename);
}

const pathToScripts = fileURLToPath(new URL("./scripts", import.meta.url));

/** Lists all filenames in `./scripts/`. */
async function listAllScripts() {
	console.log({ pathToScripts });

	const stat = await fs.stat(pathToScripts);
	if (!stat.isDirectory()) {
		throw new Error(`Expected "${pathToScripts}" to be a directory.`);
	}

	const files = (await fs.readdir(pathToScripts))
		.filter((file: string) => file.endsWith(".sql"))
		.map((file) => file.replace(".sql", ""));
	return files;
}

/** Executes all sql queries that weren't executed yet, and marks them as
 * executed in the redis set. */
async function executeNewScripts() {
	const filenames = await listAllScripts();
	const executedScriptFilenames = await listExecutedScripts();
	const unexecutedScriptFilenames = filenames.filter(
		(filename) => !executedScriptFilenames.includes(filename),
	);

	if (unexecutedScriptFilenames.length === 0) return;

	try {
		await sqlConnection.begin(async (q) => {
			for (const filename of unexecutedScriptFilenames) {
				const queryAsString = await readFile(
					path.join(pathToScripts, `${filename}.sql`),
					"utf-8",
				);
				const response = await q.unsafe(queryAsString);
				console.log({ message: `Ran sql script "${filename}"`, response });
				await markScriptAsExecuted(filename);
			}
		});
	} catch (error) {
		// mark each of the scripts in unexecutedScriptFilenames as not executed
		// again so we can run them again later.
		for (const filename of unexecutedScriptFilenames) {
			await markScriptAsNotExecuted(filename);
		}
	}
}

/** Checks whether all scripts have been marked as executed. */
async function allScriptsWereExecuted() {
	const filenames = await listAllScripts();
	const executedScriptFilenames = await listExecutedScripts();
	return filenames.every((filename) => executedScriptFilenames.includes(filename));
}

const scriptCache = {
	_key: getScriptCacheKey(),
	listExecuted: listExecutedScripts,
	listFiles: listAllScripts,
	check: scriptHasBeenExecuted,
	set: markScriptAsExecuted,
	synchronize: executeNewScripts,
	isSynchronized: allScriptsWereExecuted,
};

export default scriptCache;
