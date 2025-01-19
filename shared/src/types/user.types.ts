import { ID } from "types/utility.types";
import { string } from "types/zod.utility.types";
import { z } from "zod";

export const newUserSchema = z.object({
	email: string,
	username: string,
	password: string,
});

export const userSchema = newUserSchema.omit({ password: true }).extend({
	user_id: string,
	password_hash: string,
	created_at: string, // or is it a Date?
});

export const userWithoutPasswordSchema = userSchema.omit({
	password_hash: true,
});

/** This is what the client creates for the backend to insert into the database. */
export type NewUser = z.infer<typeof newUserSchema>;

/** This directly matches the database type. */
export type User = z.infer<typeof userSchema>;

/** This is what should be passed from the server to the client, because there
 * is no reason to ever send the hash to the client. */
export type UserWithoutPassword = z.infer<typeof userWithoutPasswordSchema>;

export type VerificationEmail = {
	user_id: ID;
	email_id: ID;
	token: string;
	created_at: string; // or is it a Date?
};
