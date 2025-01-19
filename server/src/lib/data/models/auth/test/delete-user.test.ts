import { sqlConnection } from "@/db/init";
import { deleteUser } from "@/lib/data/models/auth/delete-user";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import { queryUserById } from "@/lib/data/models/auth/query-user";

describe("deleteUser", () => {
	it("should delete a user", async () => {
		await sqlConnection.begin(async (sql) => {
			const newUser = await insertUser({
				sql,
				newUserInput: {
					email: "me@test.com",
					password_hash: "hunter2",
					username: "me",
				},
			});

			const user = await deleteUser({ sql: sql, user_id: newUser.user_id });

			expect(user).toEqual(newUser);

			const foundUser = await queryUserById({ sql, user_id: newUser.user_id });
			expect(foundUser).toBeFalsy();

			await sql`rollback`;
		});
	});
	it("should return undefined if user does not exist", async () => {
		await sqlConnection.begin(async (sql) => {
			const user = await deleteUser({ sql, user_id: "0" });
			expect(user).toBeUndefined();
			await sql`rollback`;
		});
	});
});
