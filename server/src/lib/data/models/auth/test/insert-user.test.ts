import { sqlConnection } from "@/db/init";
import { insertUser } from "@/lib/data/models/auth/insert-user";

describe("insertUser", () => {
	it("should insert a new user", async () => {
		const newUserInput = {
			password_hash: "hunter2",
			email: "me@example.com",
			username: "me",
		};

		await sqlConnection.begin(async (sql) => {
			const user = await insertUser({
				sql,
				newUserInput,
			});

			expect(user).toEqual(expect.objectContaining(newUserInput));
			expect(user).toHaveProperty("user_id");
			expect(user).toHaveProperty("created_at");
			expect(user).toHaveProperty("is_active");

			await sql`rollback`;
		});
	});
});
