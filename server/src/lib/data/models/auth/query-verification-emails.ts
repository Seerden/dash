import type { VerificationEmail } from "@shared/types/user.types";
import type { ID } from "@shared/types/utility.types";
import { query } from "@/lib/query-function";

/** Query verification emails. Optionally filter by `user_id` and/or `email_id`. */
export const queryVerificationEmails = query(
	async (
		sql,
		{
			filter,
		}: {
			filter?: {
				user_ids?: ID[];
				email_ids?: ID[];
			};
		} = {}
	) => {
		const { user_ids, email_ids } = filter || {};

		const verificationEmails = await sql<[VerificationEmail?]>`
      SELECT * FROM verification_emails
      WHERE
        ${user_ids ? sql`user_id in ${sql(user_ids)}` : sql`TRUE`}
        AND ${email_ids ? sql`email_id = ANY(${email_ids})` : sql`TRUE`};
   `;

		return verificationEmails;
	}
);
