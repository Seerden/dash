import type { User } from "@shared/types/user.types";
import type { ID } from "@shared/types/utility.types";
import { query } from "@/lib/query-function";

/**
 * @todo generalize this to work with any table and combination of non-mutable fields
 */
function stripNonMutableFields(user: Partial<User> & Pick<User, "user_id">) {
	const { user_id, created_at, is_active, ...mutableFields } = user;
	return mutableFields;
}

/** Query to update the mutable update fields. These are the fields that the
 * user specifies themselves, like their password, username, email address. */
export const updateUserFields = query(
	async (sql, { user }: { user: Partial<User> & Pick<User, "user_id"> }) => {
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
	}
);

/** Activate, or deactivate (value = false) a user by `user_id`. */
export const activateUser = query(
	async (sql, { user_id, value = true }: { user_id: ID; value?: boolean }) => {
		const [updatedUser] = await sql<[User]>`
      UPDATE users
      SET is_active = ${value}
      WHERE user_id = ${user_id}
      RETURNING *;
   `;
		return updatedUser;
	}
);
