import { TABLES } from "@shared/types/table.types";
import type { NewUserInput, User } from "@shared/types/user.types";
import { query } from "@/lib/query-function";

/** Inserts the given newUserInput into the database and returns the inserted
 * User row. */
export const insertUser = query(async (sql, {newUserInput}: {newUserInput: NewUserInput}) => {
const [user] = await sql<[User]>`
      INSERT INTO ${sql(TABLES.USERS)} ${sql(newUserInput)}
      RETURNING *
   `;

	return user;
})
