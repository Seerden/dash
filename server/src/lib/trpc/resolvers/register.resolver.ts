import { newUserSchema } from "@shared/types/user.types";
import { hash } from "argon2";
import { sqlConnection } from "@/db/init";
import { generateEmailVerificationToken } from "@/lib/auth/generate-email-verification-token";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import { insertVerificationEmail } from "@/lib/data/models/auth/insert-verification-email";
import { credentialsAvailable } from "@/lib/data/models/auth/query-user";
import verificationTokenStore from "@/lib/data/models/auth/store/verification-token.store";
import { sendVerificationEmail } from "@/lib/resend/emails/verification-email";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { ERRORS } from "@/lib/trpc/resolvers/constants/errors";
import { verificationEmailSentResponse } from "@/lib/trpc/resolvers/constants/responses";

/** Registers a user if the provided credentials are available. Sends them a
 * verification email, and stores the email in the database, and theverification
 * token in the store. */
export const register = publicProcedure
	.input(newUserSchema)
	.mutation(async ({ input, ctx }) => {
		const { username, email, password } = input;

		if (ctx.req.session.user) throw ERRORS.ALREADY_LOGGED_IN;

		if (!(await credentialsAvailable({ username, email }))) {
			// Username enumeration vulnerability -- do not communicate that
			// username/email is taken.
			return verificationEmailSentResponse;
		}

		return await sqlConnection.begin(async (sql) => {
			try {
				const user = await insertUser({
					newUserInput: {
						email,
						username,
						password_hash: await hash(password),
					},
				});

				const token = generateEmailVerificationToken();
				const verificationEmail = await sendVerificationEmail({
					token,
					user,
				});

				await verificationTokenStore.set(token, user.user_id);
				await insertVerificationEmail({
					email: {
						email_id: verificationEmail.id,
						user_id: user.user_id,
						token,
					},
				});

				return verificationEmailSentResponse;
			} catch (error) {
				await sql`rollback`;

				throw ERRORS.REGISTRATION_FAILED;
			}
		});
	});
