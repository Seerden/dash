import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import type { UserWithoutPassword } from "@shared/types/user.types";
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
						// `destroy` is the only thing we need from the prototype
						// chain -- it's not copied over if we just do
						// `...opts.ctx.req.session`
						destroy: opts.ctx.req.session.destroy,
						user: opts.ctx.req.session.user satisfies UserWithoutPassword,
					},
				},
			},
		});
	}
});
