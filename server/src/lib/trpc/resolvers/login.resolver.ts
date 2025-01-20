import { queryUserByName } from "@/lib/data/models/auth/query-user";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { userInputSchema } from "@shared/types/user.types";
import { TRPCError } from "@trpc/server";
import { verify } from "argon2";

export const login = publicProcedure
	.input(userInputSchema)
	.mutation(async ({ ctx, input }) => {
		const foundUser = await queryUserByName({ username: input.username });

		if (!foundUser) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Invalid credentials.",
			});
		}

		const passwordMatches = await verify(foundUser.password_hash, input.password);

		if (!passwordMatches) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Invalid credentials.",
			});
		}

		const user = stripSensitiveUserData(foundUser);

		console.log({ ctx });
		ctx.req.session.user = user;
		console.log({ ctx });

		return {
			user,
		};
	});
