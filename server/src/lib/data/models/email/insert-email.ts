import type { Email } from "@shared/types/email.types";
import { emailSchema } from "@shared/types/email.types";
import { TABLES } from "@shared/types/table.types";
import { query } from "@/lib/query-function";

/** Takes an `email`, which we got elsewhere from the resend API, and inserts it
 * in the database so we can refer to it later. */
export const insertEmail = query(async (sql, { email }: { email: Email }) => {
	emailSchema.parse(email);

	const [foundEmail] = await sql<[Email]>`
         INSERT INTO ${sql(TABLES.EMAILS)} ${sql(email)} 
         RETURNING *;
      `;

	return foundEmail;
});
