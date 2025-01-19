import { sqlConnection } from "@/db/init";
import { deleteUser } from "@/lib/data/models/auth/delete-user";
import { insertUser } from "@/lib/data/models/auth/insert-user";

describe("deleteUser", () => {
	it("should delete a user", async () => {
		await sqlConnection.begin(async (q) => {
			const newUser = await insertUser({
				sql: q,
				newUserInput: {
					email: "me@test.com",
					password_hash: "hunter2",
					username: "me",
				},
			});

			const user = await deleteUser({ sql: q, user_id: newUser.user_id });

			expect(user).toEqual(newUser);

			// try to get user by id and expect it to be null

			await q`rollback`;
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
