import { sqlConnection } from "@/db/init";
import { insertVerificationEmail } from "@/lib/data/models/auth/insert-verification-email";
import { queryVerificationEmails } from "@/lib/data/models/auth/query-verification-emails";
import { createMockEmail, createMockUser } from "@/lib/data/models/auth/test/mocks";
import type { NewVerificationEmail, VerificationEmail } from "@shared/types/user.types";

const email: VerificationEmail = {
	created_at: "",
	email_id: "1",
	token: "",
	user_id: "1",
};

describe("queryVerificationEmails", () => {
	it("should query all emails", async () => {
		await sqlConnection.begin(async (sql) => {
			const emails = await queryVerificationEmails({
				sql,
			});
			expect(emails).toEqual([]);
		});

		await sqlConnection.begin(async (sql) => {
			const user = await createMockUser(sql);
			const testEmail = await createMockEmail(sql);
			const email: NewVerificationEmail = {
				email_id: testEmail.id,
				token: "",
				user_id: user.user_id,
			};
			// create a new email, then query all emails, see if it's in the list.
			await insertVerificationEmail({ sql, email });
			const emails = await queryVerificationEmails({ sql });
			expect(emails).toBeDefined();
			expect(emails).toEqual(expect.arrayContaining([expect.objectContaining(email)]));
			expect(emails[0]?.email_id).toEqual(email.email_id);

			await sql`rollback`;
		});
	});
	it("should query by user_id", async () => {
		await sqlConnection.begin(async (sql) => {
			const user = await createMockUser(sql);
			const mockEmail = await createMockEmail(sql);

			const verificationEmail = await insertVerificationEmail({
				sql,
				email: {
					email_id: mockEmail.id,
					token: "",
					user_id: user.user_id,
				},
			});
			const emails = await queryVerificationEmails({
				sql,
				filter: {
					user_ids: [user.user_id],
				},
			});
			expect(emails).toContainEqual(verificationEmail);
			await sql`rollback`;
		});
	});
});
