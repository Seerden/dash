import { newEmailMock } from "@/lib/data/models/auth/test/mocks";
import { insertEmail } from "@/lib/data/models/email/insert-email";
import { createTransaction } from "@/lib/query-function";

describe("insertEmail", () => {
	it("should insert an email into the database", async () => {
		await createTransaction(async (q) => {
			const email = await insertEmail({ email: newEmailMock });

			expect(email).toBeDefined();
			expect(email).toMatchObject(newEmailMock);

			await q`rollback`;
		});
	});
});
