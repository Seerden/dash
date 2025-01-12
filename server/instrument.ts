// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import type { ErrorRequestHandler, Response } from "express";

Sentry.init({
	dsn: "https://f03ede6b86784fda49e2fc75bf8bb29e@o4508463516680192.ingest.de.sentry.io/4508574988828752",
	integrations: [nodeProfilingIntegration()],
	// Tracing
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

export { Sentry };

interface CustomResponse extends Response {
	sentry?: string;
}

export const onError: ErrorRequestHandler = (err, req, res: CustomResponse, next) => {
	console.error(err);
	res.statusCode = 500;
	res.end(res.sentry + "\n");
};
