import { sessionCookieName } from "@/lib/redis-client";
import { authenticatedProcedure } from "@/lib/trpc/procedures/authenticated.procedure";

/** Destroys the session cookie and request session object. */
export const logout = authenticatedProcedure.mutation(async ({ ctx }) => {
	ctx.res.clearCookie(sessionCookieName);
	ctx.req.session.destroy(() => {});

	return {
		success: true,
	};
});
