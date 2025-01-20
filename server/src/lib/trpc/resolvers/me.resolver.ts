import { queryUserById } from "@/lib/data/models/auth/query-user";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";
import { authenticatedProcedure } from "@/lib/trpc/procedures/authenticated.procedure";
import { ERRORS } from "@/lib/trpc/resolvers/constants/errors";

/** Returns the currently authenticated user with sensitive fields (=
 * password_hash) stripped. */
export const me = authenticatedProcedure.query(async (opts) => {
	const user_id = opts.ctx.req.session.user.user_id;
	const user = await queryUserById({ user_id });

	if (!user) throw ERRORS.USER_NOT_FOUND;

	return {
		user: stripSensitiveUserData(user),
	};
});
