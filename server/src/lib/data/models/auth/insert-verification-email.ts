import { sqlConnection } from "@/db/init";
import { TABLES } from "@shared/types/table.types";
import type { NewVerificationEmail, VerificationEmail } from "@shared/types/user.types";
import type { QueryFunction } from "types/utility.types";

/** Inserts a verification email into the database. */
export const insertVerificationEmail: QueryFunction<
	{ email: NewVerificationEmail },
	VerificationEmail
> = async ({ sql = sqlConnection, email }) => {
	const [verificationEmail] = await sql<[VerificationEmail]>`
      INSERT INTO ${sql(TABLES.VERIFICATION_EMAILS)} ${sql(email)}
      RETURNING *
   `;

	return verificationEmail;
};
