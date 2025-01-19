import { sqlConnection } from "@/db/init";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { logout } from "@/lib/trpc/resolvers/logout.resolver";
import { me } from "@/lib/trpc/resolvers/me.resolver";
import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import SuperJSON from "superjson";
import { z } from "zod";

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
	hello: "world",
	req,
	res,
	session: {
		user: req.session.user,
	}, // TODO: this should only be applied to the authenticated procedure.
});
type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});

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
	me,
	logout,
});

export type AppRouter = typeof appRouter;
