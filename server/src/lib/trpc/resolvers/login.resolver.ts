import { userInputSchema } from "@shared/types/user.types";
import { verify } from "argon2";
import { queryUserByName } from "@/lib/data/models/auth/query-user";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { ERRORS } from "@/lib/trpc/resolvers/constants/errors";
import { logUserIn } from "@/lib/trpc/resolvers/log-user-in";

/** Takes user credentials and attempts to log the user in.
 * @todo consider logging any existing user out before any login attempt. */
export const login = publicProcedure
	.input(userInputSchema)
	.mutation(async ({ ctx, input }) => {
		const { username, password } = input;

		const foundUser = await queryUserByName({ username });
		if (!foundUser) throw ERRORS.INVALID_CREDENTIALS;

		const passwordMatches = await verify(foundUser.password_hash, password);
		if (!passwordMatches) throw ERRORS.INVALID_CREDENTIALS;

		const user = stripSensitiveUserData(foundUser);
		if (!user) throw ERRORS.INVALID_CREDENTIALS;
		await logUserIn(ctx, user);
		return { user };
	});
