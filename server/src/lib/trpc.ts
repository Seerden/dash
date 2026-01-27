import {
	createTRPCClient,
	httpBatchLink,
	httpLink,
	isNonJsonSerializable,
	splitLink,
} from "@trpc/client";
import superjson from "superjson";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { authRouter } from "@/lib/trpc/routers/auth.router";
import { priceActionRouter } from "@/lib/trpc/routers/price-action.router";
import { t } from "@/lib/trpc/trpc-context";

// TODO: needs to match what we use in the client, I guess
// TODO (DAS-55) production-aware
const url = "http://localhost:5000/api/trpc";

export const appRouter = t.router({
	auth: authRouter,
	priceAction: priceActionRouter,
	test: publicProcedure.query(async () => {
		return "hello";
	}),
});

export type AppRouter = typeof appRouter;

export const proxyClient = createTRPCClient<AppRouter>({
	links: [
		splitLink({
			condition: (op) => isNonJsonSerializable(op.input),
			true: httpLink({
				url,
				transformer: {
					// request - convert data before sending to the tRPC server
					serialize: (data) => data,
					// response - convert the tRPC response before using it in client
					deserialize: superjson.deserialize, // or your other transformer
				},
			}),
			false: httpBatchLink({
				transformer: superjson,
				url,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: "include",
					});
				},
			}),
		}),
	],
});
