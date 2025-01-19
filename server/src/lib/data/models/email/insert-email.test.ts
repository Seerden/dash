import { sqlConnection } from "@/db/init";
import { newEmailMock } from "@/lib/data/models/auth/test/mocks";
import { insertEmail } from "@/lib/data/models/email/insert-email";

describe("insertEmail", () => {
	it("should insert an email into the database", async () => {
		await sqlConnection.begin(async (q) => {
			const email = await insertEmail({ sql: q, email: newEmailMock });

			expect(email).toBeDefined();
			expect(email).toMatchObject(newEmailMock);

			await q`rollback`;
		});
	});
});
