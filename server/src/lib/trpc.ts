import { generateEmailHtml, testThing } from "@shared/lib/email/EmailTest";
import { initTRPC, TRPCError } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import SuperJSON from "superjson";
import { z } from "zod";

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
	hello: "world",
	session: {
		user: req.session.user,
	}, // TODO: this should only be applied to the authenticated procedure.
});
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});

export const publicProcedure = t.procedure.use(async (opts) => {
	try {
		return opts.next(opts);
	} catch (error) {
		// do something here? or use router's onError?
		return opts.next(opts);
	}
});

export const authenticatedProcedure = publicProcedure.use(async (opts) => {
	if (!opts.ctx.session.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Must be logged in to access this resource.",
		});
	} else {
		return opts.next(opts);
	}
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
	// TODO: remove this one. This is just for testing purposes.
	DEV_emailTest: publicProcedure.query(() => {
		return {
			html: generateEmailHtml("https://google.com"),
			test: testThing("hi"),
		};
	}),
	me: authenticatedProcedure.query(({ ctx }) => {
		return {
			user: ctx.session.user,
			who: "am i",
		};
	}),
});

export type AppRouter = typeof appRouter;
