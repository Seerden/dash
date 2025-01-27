import { sqlConnection } from "@/db/init";
import { createMockUser } from "@/lib/data/models/auth/test/mocks";
import { stripSensitiveUserData } from "@/lib/data/strip-sensitive-user-data";

describe("stripSensitiveUserData", () => {
	it("should strip sensitive data", async () => {
		await sqlConnection.begin(async (sql) => {
			const user = await createMockUser(sql);
			const stripped = stripSensitiveUserData(user);

			expect(stripped).toBeDefined();
			expect(user).toHaveProperty("password_hash");
			expect(stripped).not.toHaveProperty("password_hash");

			await sql`rollback`;
		});
	});
});
