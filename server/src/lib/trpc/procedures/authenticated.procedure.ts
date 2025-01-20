import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { TRPCError } from "@trpc/server";

export const authenticatedProcedure = publicProcedure.use(async (opts) => {
	if (!opts.ctx.req.session.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Must be logged in to access this resource.",
		});
	} else {
		return opts.next({
			...opts,
			ctx: {
				...opts.ctx,
				req: {
					...opts.ctx.req,
					session: {
						...opts.ctx.req.session,
						user: opts.ctx.req.session.user,
					},
				},
			},
		});
	}
});
