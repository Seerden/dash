import { queryUserByName } from "@/lib/data/models/auth/query-user";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { userInputSchema } from "@shared/types/user.types";
import { TRPCError } from "@trpc/server";
import { verify } from "argon2";

export const login = publicProcedure
	.input(userInputSchema)
	.mutation(async ({ ctx, input }) => {
		const user = await queryUserByName({ username: input.username });

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found.",
			});
		}

		const passwordMatches = await verify(input.password, user.password_hash);

		if (!passwordMatches) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Invalid credentials.",
			});
		}

		ctx.req.session.user = user;

		return {
			user: stripSensitiveUserData(user),
		};
	});
