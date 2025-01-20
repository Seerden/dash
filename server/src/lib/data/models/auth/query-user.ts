import { sqlConnection } from "@/db/init";
import { TABLES } from "@shared/types/table.types";
import type { User } from "@shared/types/user.types";
import type { ID, Maybe } from "@shared/types/utility.types";
import type { QueryFunction } from "types/utility.types";

/** Queries a user by `user_id`. */
export const queryUserById: QueryFunction<{ user_id: ID }, Maybe<User>> = async ({
	sql = sqlConnection,
	user_id,
}) => {
	const [user] = await sql<[User?]>`
      SELECT * FROM users
      WHERE user_id = ${user_id};
   `;

	return user;
};

/** Queries a user by `username`. @todo test */
export const queryUserByName: QueryFunction<{ username: string }, Maybe<User>> = async ({
	sql = sqlConnection,
	username,
}) => {
	const [user] = await sql<[User?]>`
      SELECT * FROM users
      WHERE username = ${username};
   `;

	return user;
};

/** Return true if username and email are both not taken yet.
 * @todo test this function
 */
export const credentialsAvailable: QueryFunction<
	Pick<User, "email" | "username">,
	boolean
> = async ({ sql = sqlConnection, email, username }) => {
	const [result] = await sql<[User?]>`
         SELECT * from ${sql(TABLES.USERS)}
         WHERE email = ${email} OR username = ${username}
   `;

	return Boolean(!result?.user_id);
};
