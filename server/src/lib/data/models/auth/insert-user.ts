import { TABLES } from "@shared/types/table.types";
import type { NewUserInput, User } from "@shared/types/user.types";
import type { QueryFunction } from "types/utility.types";
import { sqlConnection } from "@/db/init";

/** Inserts the given newUserInput into the database and returns the inserted
 * User row. */
export const insertUser: QueryFunction<
	{ newUserInput: NewUserInput },
	User
> = async ({ sql = sqlConnection, newUserInput }) => {
	const [user] = await sql<[User]>`
      INSERT INTO ${sql(TABLES.USERS)} ${sql(newUserInput)}
      RETURNING *
   `;

	return user;
};
