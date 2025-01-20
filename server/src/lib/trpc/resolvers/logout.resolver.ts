import { sessionCookieName } from "@/lib/redis-client";
import { authenticatedProcedure } from "@/lib/trpc/procedures/authenticated.procedure";
import { logoutResponse } from "@/lib/trpc/resolvers/constants/responses";

/** Logs out any existing user by clearing the session. */
export const logout = authenticatedProcedure.mutation(async ({ ctx }) => {
	ctx.res.clearCookie(sessionCookieName);
	ctx.req.session.destroy(() => {});

	return {
		...logoutResponse,
		user: ctx.req.session?.user,
	};
});
