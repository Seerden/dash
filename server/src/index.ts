import { tryPingingDatabase } from "@/db/init";
import scriptCache from "@/db/scripts/script.cache";
import { NODE__dirname } from "@/lib/build.utility";
import { createPriceActionWorker } from "@/lib/polygon/flatfiles/queue/worker";
import { initializeRedisConnection, redisSession } from "@/lib/redis-client";
import { runAtStartup } from "@/lib/run-at-startup";
import { appRouter } from "@/lib/trpc";
import { createContext } from "@/lib/trpc/trpc-context";
import * as trpcExpress from "@trpc/server/adapters/express";
import cluster from "cluster";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";

async function start() {
	if (cluster.isPrimary) {
		const cpuCount = (await import("os")).cpus().length;
		console.log({ cpuCount });

		console.info(`Primary cluster ${process.pid} is running`);

		await runAtStartup();
		// TODO: retry logic for these, for production
		await initializeRedisConnection();
		await tryPingingDatabase();
		await scriptCache.synchronize();

		for (const _ of Array(cpuCount / 2).keys()) {
			cluster.fork();
		}
	} else {
		const _worker = createPriceActionWorker();

		const app = express();

		app.use(
			cors({
				// TODO: use custom origin: allow any port from the base domain, which
				// will be localhost or process.env.DOMAIN
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
					console.log({ error: opts.error, body: opts.req.body }); // TODO: proper error handling
				},
				allowBatching: true, // this _should_ be the default, but I was having issues with empty request bodies, and this may have fixed it.
			}),
		);

		const port = process.env.PORT ?? 5000;

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
			console.log(
				`${new Date().toISOString()}: pid ${process.pid} - server is running on port ${port}`,
			);
		});
	}
}

try {
	start();
} catch (error) {
	console.error(error);
}
