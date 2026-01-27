import { TABLES } from "@shared/types/table.types";
import type { User } from "@shared/types/user.types";
import type { ID } from "@shared/types/utility.types";
import { query } from "@/lib/query-function";

/** Queries a user by `user_id`. */
export const queryUserById = query(
	async (sql, { user_id }: { user_id: ID }) => {
		const [user] = await sql<[User?]>`
      SELECT * FROM ${sql(TABLES.USERS)}
      WHERE user_id = ${user_id};
   `;

		return user;
	}
);

/** Queries a user by `username`. */
export const queryUserByName = query(
	async (sql, { username }: { username: string }) => {
		const [user] = await sql<[User?]>`
      SELECT * FROM ${sql(TABLES.USERS)}
      WHERE username = ${username};
   `;

		return user;
	}
);

/** Check if either username or email are taken yet. */
export const credentialsAvailable = query(
	async (sql, { email, username }: Pick<User, "email" | "username">) => {
		const [result] = await sql<[User?]>`
         SELECT * from ${sql(TABLES.USERS)}
         WHERE email = ${email} OR username = ${username}
   `;

		return Boolean(!result?.user_id);
	}
);
