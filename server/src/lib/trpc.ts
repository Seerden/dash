import {
	createTRPCClient,
	httpBatchLink,
	httpLink,
	isNonJsonSerializable,
	splitLink,
} from "@trpc/client";
import superjson from "superjson";
import { login } from "@/lib/trpc/resolvers/login.resolver";
import { logout } from "@/lib/trpc/resolvers/logout.resolver";
import { me } from "@/lib/trpc/resolvers/me.resolver";
import {
	flatDailyPriceActionResolver,
	groupedDailyPriceActionResolver,
} from "@/lib/trpc/resolvers/price-action/daily.resolver";
import { register } from "@/lib/trpc/resolvers/register.resolver";
import { verifyMe } from "@/lib/trpc/resolvers/verify-me.resolver";
import { t } from "@/lib/trpc/trpc-context";

// TODO: needs to match what we use in the client, I guess
// TODO (DAS-55) production-aware
const url ="http://localhost:5000/api/trpc";

export const appRouter = t.router({
	auth: {
		me,
		logout,
		login,
		register,
		verifyMe,
	},
	priceAction: {
		daily: {
			flat: flatDailyPriceActionResolver,
			grouped: groupedDailyPriceActionResolver,
		},
	},
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
