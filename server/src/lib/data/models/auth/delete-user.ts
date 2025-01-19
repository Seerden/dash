import { sqlConnection } from "@/db/init";
import { TABLES } from "@shared/types/table.types";
import type { User } from "@shared/types/user.types";
import type { ID } from "@shared/types/utility.types";
import type { QueryFunction } from "types/utility.types";

/** Deletes the user with the given `user_id`. */
export const deleteUser: QueryFunction<{ user_id: ID }, User> = async ({
	sql = sqlConnection,
	user_id,
}) => {
	const [user] = await sql<[User]>`
      DELETE FROM ${sql(TABLES.USERS)}
      WHERE user_id = ${user_id}
      RETURNING *;
   `;

	return user;
};
