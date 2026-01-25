import { query } from "@/lib/query-function";
import { TABLES } from "@shared/types/table.types";
import type { User } from "@shared/types/user.types";
import type { ID } from "@shared/types/utility.types";

/** Deletes the user with the given `user_id`. */
export const deleteUser = query(async (sql, {user_id}: { user_id: ID }) => {
	const [user] = await sql<[User]>`
      DELETE FROM ${sql(TABLES.USERS)}
      WHERE user_id = ${user_id}
      RETURNING *;
   `;

	return user;
})
