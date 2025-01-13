import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import type { SessionData } from "express-session";
import SuperJSON from "superjson";
import { z } from "zod";

// extends the Request type to include the session.
// the typing or session.user comes from types/index.d.ts.
type ExpressRequest = Omit<trpcExpress.CreateExpressContextOptions, "req"> & {
	req: Request & { session: SessionData };
};

export const createContext = ({ req, res }: ExpressRequest) => ({
	hello: "world",
	session: req.session.user, // TODO: this should only be applied to the authenticated procedure.
});
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});

export const appRouter = t.router({
	hello: t.procedure.input(z.object({ name: z.string() })).query(({ input, ctx }) => {
		return { message: `Hello, ${input.name}!`, hello: ctx.hello };
	}),
});

export type AppRouter = typeof appRouter;
