import { sqlConnection } from "@/db/init";
import type { Email } from "@shared/types/email.types";
import { emailSchema } from "@shared/types/email.types";
import { TABLES } from "@shared/types/table.types";
import { type Maybe } from "@shared/types/utility.types";
import type { QueryFunction } from "types/utility.types";

/** Takes an `email`, which we got elsewhere from the resend API, and inserts it
 * in the database so we can refer to it later. */
export const insertEmail: QueryFunction<
	{
		email: Email;
	},
	Promise<Maybe<Email>>
> = async ({
	sql = sqlConnection,
	email,
}: {
	sql?: typeof sqlConnection;
	email: Email;
}) => {
	try {
		emailSchema.parse(email);

		const [foundEmail] = await sql<[Email?]>`
         INSERT INTO ${sql(TABLES.EMAILS)} ${sql(email)} 
         RETURNING *;
      `;

		return foundEmail;
	} catch (error) {
		console.error(error);
		// TODO: email parsing probably failed -- handle failed insertion here.
	}
};
