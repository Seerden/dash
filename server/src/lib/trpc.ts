import { sqlConnection } from "@/db/init";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { z } from "zod";
import { publicProcedure } from "./trpc/procedures/public.procedure";
import { login } from "./trpc/resolvers/login.resolver";
import { logout } from "./trpc/resolvers/logout.resolver";
import { me } from "./trpc/resolvers/me.resolver";
import {
	flatDailyPriceActionResolver,
	groupedDailyPriceActionResolver,
} from "./trpc/resolvers/price-action/daily.resolver";
import { flatFilesStatusResolver } from "./trpc/resolvers/price-action/flatfiles.resolver";
import { register } from "./trpc/resolvers/register.resolver";
import { verifyMe } from "./trpc/resolvers/verify-me.resolver";
import { t } from "./trpc/trpc-context";

export const appRouter = t.router({
	hello: publicProcedure
		.input(z.object({ name: z.string() }))
		.query(({ input, ctx }) => {
			return { message: `Hello, ${input.name}!` };
		}),
	bye: publicProcedure.input(z.object({ name: z.string() })).query(({ input, ctx }) => {
		return { message: `Hello, ${input.name}!` };
	}),
	dbTest: publicProcedure.query(async () => {
		{
			// const result = await pingDatabase();
			return {
				sql: sqlConnection,
				db: await sqlConnection`select array[1]`,
				env: process.env,
				who: "am i",
			};
		}
	}),
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
		status: flatFilesStatusResolver,
	},
});

export type AppRouter = typeof appRouter;

export const proxyClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			transformer: superjson,
			url: "http://localhost:5000/api/trpc", // TODO: needs to match what we use in the client, I guess
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		}),
	],
});
