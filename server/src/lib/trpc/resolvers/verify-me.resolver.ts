import { queryUserByName } from "@/lib/data/models/auth/query-user";
import verificationTokenStore from "@/lib/data/models/auth/store/verification-token.store";
import { activateUser } from "@/lib/data/models/auth/update-user";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { ERRORS } from "@/lib/trpc/resolvers/constants/errors";
import { logUserIn } from "@/lib/trpc/resolvers/log-user-in";
import { accountVerificationSchema } from "@shared/types/verification.types";

/** If there is an inactive account with an active verification token, this
 * takes the given `token` and `username`, activates the user's account, and
 * logs them in. */
export const verifyMe = publicProcedure
	.input(accountVerificationSchema)
	.mutation(async ({ ctx, input }) => {
		const { token, username } = input;

		const user = await queryUserByName({ username });
		if (!user) return;

		const storedToken = await verificationTokenStore.get(user.user_id);
		if (!storedToken || token !== storedToken) return;

		const activatedUser = stripSensitiveUserData(
			await activateUser({ user_id: user.user_id }),
		);

		if (!activatedUser) throw ERRORS.ACTIVATION_FAILED;

		await verificationTokenStore.clear(user.user_id);

		await logUserIn(ctx, activatedUser);

		return activatedUser;
	});
