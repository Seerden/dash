import { queryUserByName } from "@/lib/data/models/auth/query-user";
import verificationTokenStore from "@/lib/data/models/auth/store/verification-token.store";
import { activateUser } from "@/lib/data/models/auth/update-user";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { z } from "zod";

const accountVerificationSchema = z.object({
	token: z.string(),
	username: z.string().min(3),
});

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

		// remove token from the store!
		await verificationTokenStore.clear(user.user_id);

		ctx.req.session.user = activatedUser;

		return activatedUser;
	});
