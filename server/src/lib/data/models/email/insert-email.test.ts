import { sqlConnection } from "@/db/init";
import { insertEmail } from "@/lib/data/models/email/insert-email";
import { emailSchema, type Email } from "@shared/types/email.types";

describe("insertEmail", () => {
	it("should insert an email into the database", async () => {
		const testEmail: Email = emailSchema.parse({
			object: "email",
			id: "f1812e9e-85f7-44a8-a329-1d160ff0bb9a",
			to: ["christiaanseerden@live.nl"],
			from: "Admin <test@auth.seerden.dev>",
			created_at: "2025-01-14 13:27:42.147688+00",
			subject: "Hello, world",
			bcc: null,
			cc: null,
			reply_to: null,
			last_event: "sent",
			html: "<h1>Hello, world</h1>",
			text: null,
			scheduled_at: null,
		});

		await sqlConnection.begin(async (q) => {
			const email = await insertEmail({ sql: q, email: testEmail });

			expect(email).toBeDefined();
			expect(email).toMatchObject(testEmail);

			await q`rollback`;
		});
	});
});
