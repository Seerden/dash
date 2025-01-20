import { insertUser } from "@/lib/data/models/auth/insert-user";
import { insertEmail } from "@/lib/data/models/email/insert-email";
import { emailSchema } from "@shared/types/email.types";
import type { NewUserInput } from "@shared/types/user.types";
import type { SQL } from "types/utility.types";

export const newUser: NewUserInput = {
	email: "me@example.com",
	password_hash: "hunter2",
	username: "i_am_me",
};

export async function createMockUser(sql: SQL) {
	const user = await insertUser({ sql, newUserInput: newUser });
	return user;
}

export const newEmailMock = emailSchema.parse({
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

export async function createMockEmail(sql: SQL) {
	return await insertEmail({ sql, email: newEmailMock });
}
