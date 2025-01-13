import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import type { SessionData } from "express-session";
import SuperJSON from "superjson";
import { z } from "zod";

// Extends trpcExpress Request to include the session, where .user comes from
// types/index.d.ts.
type ExpressRequest = Omit<trpcExpress.CreateExpressContextOptions, "req"> & {
	req: Request & { session: SessionData };
};

export const createContext = ({ req, res }: ExpressRequest) => ({
	// TODO: this is where we would add the session object, for example
	hello: "world",
	// TODO: this should only be applied to the authenticated procedure.
	session: req.session.user,
});
type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});

// Define your router
export const appRouter = t.router({
	hello: t.procedure.input(z.object({ name: z.string() })).query(({ input, ctx }) => {
		return { message: `Hello, ${input.name}!`, hello: ctx.hello };
	}),
});

// Export router type for client
export type AppRouter = typeof appRouter;
