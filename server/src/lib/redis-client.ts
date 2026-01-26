import RedisStore from "connect-redis";
import type session from "express-session";
import Redis from "ioredis";

// NOTE: `store` is the name of our redis service in docker-compose, and 6379 is
// the default port, which we haven't changed.
export const redisClient = new Redis(
	`redis://:${process.env.REDIS_PASS}@store:6379`,
	{
		maxRetriesPerRequest: null,
	}
);

export const sessionCookieName = "rack-session";

export const redisSession: session.SessionOptions = {
	store: new RedisStore({ client: redisClient }),
	name: sessionCookieName,
	saveUninitialized: false,
	// biome-ignore lint/style/noNonNullAssertion: exists
	secret: process.env.SESSION_SECRET!,
	resave: false,
	rolling: true,
	cookie: {
		maxAge: 7 * 24 * 3600 * 1000, // One week.
		secure: process.env.NODE_ENV === "production",
	},
};

export async function initializeRedisConnection() {
	try {
		const ping = await redisClient.ping();
		if (ping !== "PONG") {
			await redisClient.connect();
		}
	} catch (error) {
		console.log({ error, message: "Error connecting to Redis client" });
	}
}
