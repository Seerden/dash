import { sqlConnection } from "@/db/init";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import { queryUserById } from "@/lib/data/models/auth/query-user";

describe("queryUser", () => {
	it("should query a user", async () => {
		await sqlConnection.begin(async (sql) => {
			const user = await insertUser({
				sql,
				newUserInput: {
					email: "me@example.com",
					password_hash: "hunter2",
					username: "me",
				},
			});

			const foundUser = await queryUserById({ sql, user_id: user.user_id });

			expect(foundUser).toEqual(user);

			await sql`rollback`;
		});
	});
	it("should return nothing if user does not exist", async () => {
		const user = await queryUserById({ user_id: "0" });
		expect(user).toBeUndefined();
	});
});
