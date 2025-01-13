import cors from "cors";
import express from "express";
import session from "express-session";
import { pingDatabase } from "./src/db/init";
import { initializeRedisConnection, redisSession } from "./src/lib/redis-client";
import { runAtStartup } from "./src/lib/run-at-startup";

async function start() {
	const app = express();

	app.use(
		cors({
			origin: true,
			credentials: true,
		}),
	);

	app.use(
		express.urlencoded({
			limit: "10mb",
			parameterLimit: 10000,
			extended: true,
		}),
	);

	await initializeRedisConnection();
	await pingDatabase();
	app.use(session(redisSession));

	app.use(express.json()); // TODO: is this still necessary with trpc? they use superjson as transformer

	app.get("/", async (req, res) => {
		res.json({ message: "Hello World" });
	});

	const port = process.env.PORT ?? 5000;

	await runAtStartup();

	app.listen(port, () => {
		console.log(`${new Date().toISOString()}: server is running on port ${port}`);
	});
}

start();
