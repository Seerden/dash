import { sqlConnection } from "@/db/init";
import { sendEmail } from "@/lib/resend/email";
import type { User } from "@shared/types/user.types";
import type { CreateEmailOptions } from "resend";
import type { SQL } from "types/utility.types";

const emailAddress = "auth.dash@seerden.dev";

export async function sendVerificationEmail({
	sql = sqlConnection,
	token,
	user,
}: {
	sql?: SQL;
	token: string;
	user: User;
}) {
	const payload: CreateEmailOptions = {
		from: emailAddress,
		to: user.email,
		subject: "Verify your Dash account",
		// TODO: use react-email to create a template to match our design system
		// TODO: determine host from environment
		html: `
         <h1>Verify your Dash account</h1>
         <p>Click the link below to verify your email address and complete registration.</p>
         <a href="https://dash.seerden.dev/verify-me/?token=${token}&username=${user.username}">Verify email</a>
      `,
	};

	const email = await sendEmail({ sql, payload });
	return email;
}
