import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
	// TODO: this is where we would add the session object, for example
	hello: "world",
});
type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Define your router
export const appRouter = t.router({
	hello: t.procedure.input(z.object({ name: z.string() })).query(({ input, ctx }) => {
		return { message: `Hello, ${input.name}!`, hello: ctx.hello };
	}),
});

// Export router type for client
export type AppRouter = typeof appRouter;
