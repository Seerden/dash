import { NODE__dirname } from "@/lib/build.utility";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import { pingDatabase } from "./db/init";
import { initializeRedisConnection, redisSession } from "./lib/redis-client";
import { runAtStartup } from "./lib/run-at-startup";
import { appRouter, createContext } from "./lib/trpc";

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

	// TODO: retry logic for these, for production
	await initializeRedisConnection();
	await pingDatabase();

	app.use(session(redisSession));

	app.use(express.json()); // TODO: is this still necessary with trpc? they use superjson as transformer

	app.get("/api", async (req, res) => {
		res.json({ message: "Hello World" });
	});

	app.use(
		"/api/trpc",
		trpcExpress.createExpressMiddleware({
			router: appRouter,
			createContext,
			onError: (opts) => {
				console.log({ error: opts.error }); // TODO: proper error handling
			},
		}),
	);

	const port = process.env.PORT ?? 5000;

	await runAtStartup();

	if (process.env.NODE_ENV === "production") {
		app.use(express.static(path.join(NODE__dirname, "public")));
		app.set("trust proxy", "172.17.0.0/16"); // Trust Docker's default bridge network // TODO: is this necessary?

		// note: since express v5, wildcard routes need to be named. I don't even
		// know what "splat" could be used for, but I saw it in an example, so that's
		// why I'm calling it that.
		app.get("*splat", (req, res) => {
			res.sendFile(path.join(NODE__dirname, "public", "index.html"));
		});
	}

	app.listen(port, () => {
		console.log(`${new Date().toISOString()}: server is running on port ${port}`);
	});
}

start();
