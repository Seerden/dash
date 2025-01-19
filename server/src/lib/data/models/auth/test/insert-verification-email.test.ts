import { sqlConnection } from "@/db/init";
import { insertVerificationEmail } from "@/lib/data/models/auth/insert-verification-email";
import { createMockEmail, createMockUser } from "@/lib/data/models/auth/test/mocks";
import type { NewVerificationEmail } from "@shared/types/user.types";

describe("insertVerificationEmail", () => {
	it("should insert a verification email", async () => {
		await sqlConnection.begin(async (sql) => {
			const email = await createMockEmail(sql);
			const user = await createMockUser(sql);

			const newVerificationEmail: NewVerificationEmail = {
				email_id: email.id,
				token: "example-token",
				user_id: user.user_id,
			};

			const insertedEmail = await insertVerificationEmail({
				sql,
				email: newVerificationEmail,
			});
			expect(insertedEmail).toEqual(expect.objectContaining(newVerificationEmail));

			await sql`rollback`;
		});
	});
});
