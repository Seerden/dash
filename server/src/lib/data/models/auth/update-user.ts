import { sqlConnection } from "@/db/init";
import type { User } from "@shared/types/user.types";
import type { ID, Maybe } from "@shared/types/utility.types";
import type { QueryFunction } from "types/utility.types";

/**
 * @todo generalize this to work with any table and combination of non-mutable fields
 */
function stripNonMutableFields(user: Partial<User> & Pick<User, "user_id">) {
	const { user_id, created_at, is_active, ...mutableFields } = user;
	return mutableFields;
}

/** Query to update the mutable update fields. These are the fields that the
 * user specifies themselves, like their password, username, email address. */
export const updateUserFields: QueryFunction<
	{ user: Partial<User> & Pick<User, "user_id"> },
	Maybe<User>
> = async ({ sql = sqlConnection, user }) => {
	const userToUpdate = stripNonMutableFields(user);

	if (Object.keys(userToUpdate).length === 0) {
		return;
	}

	const [updatedUser] = await sql<[User]>`
      UPDATE users
      SET ${sql(userToUpdate)}
      WHERE user_id = ${user.user_id}
      RETURNING *;
   `;
	return updatedUser;
};

/** Activate, or deactivate (value = false) a user by `user_id`. */
export const activateUser: QueryFunction<
	{ user_id: ID; value?: boolean },
	User
> = async ({ sql = sqlConnection, user_id, value = true }) => {
	const [updatedUser] = await sql<[User]>`
      UPDATE users
      SET is_active = ${value}
      WHERE user_id = ${user_id}
      RETURNING *;
   `;
	return updatedUser;
};
