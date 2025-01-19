import { sqlConnection } from "@/db/init";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import { createMockUser, newUser } from "@/lib/data/models/auth/test/mocks";
import { activateUser, updateUserFields } from "@/lib/data/models/auth/update-user";

describe("updateUserFields", () => {
	it("should update a user", async () => {
		await sqlConnection.begin(async (sql) => {
			const user = await insertUser({
				sql,
				newUserInput: newUser,
			});

			const email = Math.random().toString(12);
			const changedUser = { ...user, email };
			const updatedUser = await updateUserFields({
				sql,
				user: changedUser,
			});

			expect(updatedUser).toEqual(changedUser);

			await sql`rollback`;
		});
	});

	it("should not update a user if user does not exist", async () => {
		await sqlConnection.begin(async (sql) => {
			const updatedUser = await updateUserFields({
				sql,
				user: {
					user_id: "0",
					email: "willnotbeupdated",
				},
			});
			expect(updatedUser).not.toBeDefined();
		});
	});

	it("should not update invalid fields", async () => {
		await sqlConnection.begin(async (sql) => {
			const user = await insertUser({
				sql,
				newUserInput: newUser,
			});

			const changedUser = { ...user, user_id: "0", password_hash: "willnotbechanged" };
			const updatedUser = await updateUserFields({
				sql,
				user: changedUser,
			});

			expect(updatedUser).not.toBeDefined();

			await sql`rollback`;
		});
	});
	it("should not update a user if user is not active", async () => {});
});

describe("activateUser", () => {
	describe("existing user", async () => {
		it("should activate and deactivate a user", async () => {
			await sqlConnection.begin(async (sql) => {
				const user = await createMockUser(sql);
				expect(user.is_active).toBe(false);

				const updatedUser = await activateUser({
					sql,
					user_id: user.user_id,
					value: true,
				});
				expect(updatedUser).toEqual({ ...user, is_active: true });

				const deactivatedUser = await activateUser({
					sql,
					user_id: user.user_id,
					value: false,
				});
				expect(deactivatedUser).toEqual(user);

				await sql`rollback`;
			});
		});
	});

	describe("nonexistent user", async () => {
		it("should not act", async () => {
			await sqlConnection.begin(async (sql) => {
				const user = await activateUser({ sql, user_id: "0", value: true });
				expect(user).not.toBeDefined();

				await sql`rollback`;
			});
		});
	});
});
