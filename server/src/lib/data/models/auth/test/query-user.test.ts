import { sqlConnection } from "@/db/init";
import { insertUser } from "@/lib/data/models/auth/insert-user";
import {
	credentialsAvailable,
	queryUserById,
	queryUserByName,
} from "@/lib/data/models/auth/query-user";
import { createMockUser, newUser } from "@/lib/data/models/auth/test/mocks";
import type { User } from "@shared/types/user.types";

describe("queryUser", () => {
	describe("byId", () => {
		it("should query a user by id", async () => {
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

	describe("byName", () => {
		it("should query a user by name", async () => {
			await sqlConnection.begin(async (sql) => {
				const user = await createMockUser(sql);

				const foundUser = await queryUserByName({ sql, username: user.username });
				expect(foundUser).toEqual(user);

				await sql`rollback`;
			});
		});

		it("should return nothing if user does not exist", async () => {
			const user = {
				username: "nonexistent",
			} satisfies Partial<User>;

			const foundUser = await queryUserByName({ username: user.username });
		});
	});
});

describe("credentialsAvailable", () => {
	it("should allow any credentials if no users exist", async () => {
		await sqlConnection.begin(async (sql) => {
			const available = await credentialsAvailable({
				sql,
				...newUser,
			});

			expect(available).toBe(true);
		});
	});

	it("should disallow duplicate email", async () => {
		await sqlConnection.begin(async (sql) => {
			const mockUser = await createMockUser(sql);

			const available = await credentialsAvailable({
				sql,
				username: "another random username",
				email: mockUser.email,
			});

			expect(available).toBe(false);

			await sql`rollback`;
		});
	});

	it("should disallow duplicate username", async () => {
		await sqlConnection.begin(async (sql) => {
			const mockUser = await createMockUser(sql);

			const available = await credentialsAvailable({
				sql,
				username: mockUser.username,
				email: "another@randomemailaddress.com",
			});

			expect(available).toBe(false);

			await sql`rollback`;
		});
	});

	it("should allow new credentials", async () => {
		await sqlConnection.begin(async (sql) => {
			const _mockUser = await createMockUser(sql);

			const available = await credentialsAvailable({
				sql,
				username: "another random username",
				email: "another random email address",
			});
			expect(available).toBe(true);

			await sql`rollback`;
		});
	});
});
