import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { TRPCError } from "@trpc/server";

export const authenticatedProcedure = publicProcedure.use(async (opts) => {
	if (!opts.ctx.session.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Must be logged in to access this resource.",
		});
	} else {
		return opts.next({
			...opts,
			ctx: {
				...opts.ctx,
				session: {
					...opts.ctx.session,
					user: opts.ctx.session.user,
				},
			},
		});
	}
});
