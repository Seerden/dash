import { sqlConnection } from "@/db/init";
import { generateEmailVerificationToken } from "@/lib/auth/generate-email-verification-token";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import { insertVerificationEmail } from "@/lib/data/models/auth/insert-verification-email";
import { credentialsAvailable } from "@/lib/data/models/auth/query-user";
import verificationTokenStore from "@/lib/data/models/auth/store/verification-token.store";
import { sendVerificationEmail } from "@/lib/resend/emails/verification-email";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { verificationEmailSentResponse } from "@/lib/trpc/resolvers/constants/responses";
import { newUserSchema } from "@shared/types/user.types";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

export const register = publicProcedure
	.input(newUserSchema)
	.mutation(async ({ input, ctx }) => {
		console.log("in here :)");

		if (ctx.req.session.user) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Can't create a new account: you're already logged in.",
			});
		}

		const canRegister = await credentialsAvailable({
			username: input.username,
			email: input.email,
		});

		if (!canRegister) {
			// Username enumeration vulnerability -- do not communicate that
			// username/email is taken.
			return verificationEmailSentResponse;
		}

		const password_hash = await hash(input.password);

		return await sqlConnection.begin(async (sql) => {
			try {
				const user = await insertUser({
					sql,
					newUserInput: {
						email: input.email,
						username: input.username,
						password_hash,
					},
				});

				const token = generateEmailVerificationToken();
				const email = await sendVerificationEmail({ sql, token, user });

				await verificationTokenStore.set(token, user.user_id);
				await insertVerificationEmail({
					sql,
					email: {
						email_id: email.id,
						user_id: user.user_id,
						token,
					},
				});

				return verificationEmailSentResponse;
			} catch (error) {
				await sql`rollback`;

				throw new TRPCError({
					message: "Failed to register new user.",
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		});
	});
