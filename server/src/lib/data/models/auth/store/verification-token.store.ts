import { redisClient } from "@/lib/redis-client";
import type { ID } from "@shared/types/utility.types";

const isTestEnvironment = process.env.IS_TEST_ENVIRONMENT === "true";
const prodString = isTestEnvironment ? "test" : "prod";

/** Get all verification token cache keys. */
async function getTokenCacheKeys() {
	return await redisClient.keys(`${prodString}:tokens:verification:*`);
}

/** Gets the token cache key for the given `user_id`. */
function getTokenCacheKey(user_id: ID) {
	return `${prodString}:tokens:verification:${user_id}`;
}

/** Sets a new verification token for the user by id. */
async function setToken(user_id: ID, token: string) {
	const expiration = isTestEnvironment ? 60 * 60 : 60 * 60 * 24; // test: 1 minute expiration, prod: 24 hours expiration;
	return redisClient.set(getTokenCacheKey(user_id), token, "EX", expiration);
}

/** Gets the user's active verification token from the store, if there is one.
 */
async function getToken(user_id: ID) {
	return redisClient.get(getTokenCacheKey(user_id));
}

/** */
async function getAllTokens() {
	const keys = await getTokenCacheKeys();

	if (!keys.length) return new Map<string, string>();

	const tokens = await redisClient.mget(...keys);
	return keys.reduce((acc, key, i) => {
		const user_id = key.split(":").at(-1);
		const token = tokens[i];
		if (!user_id || !token) return acc;
		acc.set(user_id, token);
		return acc;
	}, new Map<string, string>());
}

/** Removes the user's active verification token from the store, if there is
 * one. */
async function deleteToken(user_id: ID) {
	return redisClient.del(getTokenCacheKey(user_id));
}

/** Removes all verification tokens from the store. */
async function clearAllTokens() {
	const keys = await getTokenCacheKeys();
	return redisClient.del(...keys);
}

const verificationTokenStore = {
	__key: getTokenCacheKey,
	__keys: getTokenCacheKeys,
	set: setToken,
	get: getToken,
	getAll: getAllTokens,
	clear: deleteToken,
	clearAll: clearAllTokens,
};

export default verificationTokenStore;
