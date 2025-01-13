import { redisClient } from "@/lib/redis-client";

const scriptCacheKey = {
	database: {
		up: "script:db:prod:up",
	},
	testDatabase: {
		up: "script:db:test:up",
	},
};

function getScriptCacheKey() {
	const isTestEnv = process.env.IS_TEST_ENVIRONMENT === "true";
	return isTestEnv ? scriptCacheKey.testDatabase.up : scriptCacheKey.database.up;
}

async function getExecutedScripts() {
	return redisClient.smembers(getScriptCacheKey());
}

async function scriptHasBeenExecuted(filename: string) {
	const hasRun = await redisClient.sismember(getScriptCacheKey(), filename);
	return Boolean(hasRun);
}
