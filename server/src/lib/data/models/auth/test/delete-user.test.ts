import { deleteUser } from "@/lib/data/models/auth/delete-user";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import { queryUserById } from "@/lib/data/models/auth/query-user";
import { createTransaction } from "@/lib/query-function";

describe("deleteUser", () => {
	it("should delete a user", async () => {
		await createTransaction(async (sql) => {
			const newUser = await insertUser({
				newUserInput: {
					email: "me@test.com",
					password_hash: "hunter2",
					username: "me",
				},
			});

			const user = await deleteUser({ user_id: newUser.user_id });

			expect(user).toEqual(newUser);

			const foundUser = await queryUserById({ user_id: newUser.user_id });
			expect(foundUser).toBeFalsy();

			await sql`rollback`;
		});
	});

	it("should return undefined if user does not exist", async () => {
		await createTransaction(async (sql) => {
			const user = await deleteUser({ user_id: "0" });
			await sql`rollback`;
		});
	});
});
