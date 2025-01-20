import { Datelike, ID } from "@shared/types/utility.types";
import { datelike, string } from "@shared/types/zod.utility.types";
import { z } from "zod";

export const userInputSchema = z.object({
	username: string.min(3),
	password: string.min(3),
});

export type UserInput = z.infer<typeof userInputSchema>;

export const newUserSchema = userInputSchema.extend({
	email: string,
});

export const userSchema = newUserSchema.omit({ password: true }).extend({
	user_id: string,
	password_hash: string,
	created_at: datelike,
	is_active: z.boolean(),
});

export const newUserInputSchema = userSchema.omit({
	created_at: true,
	is_active: true,
	user_id: true,
});

export const userWithoutPasswordSchema = userSchema.omit({
	password_hash: true,
});

/** This is what the client creates for the backend to insert into the database. */
export type NewUser = z.infer<typeof newUserSchema>;

/** This directly matches the database type. */
export type User = z.infer<typeof userSchema>;

/** This is what the database insert query expects. */
export type NewUserInput = z.infer<typeof newUserInputSchema>;

/** This is what should be passed from the server to the client, because there
 * is no reason to ever send the hash to the client. */
export type UserWithoutPassword = z.infer<typeof userWithoutPasswordSchema>;

export type NewVerificationEmail = {
	user_id: ID;
	email_id: ID;
	token: string;
};

export type VerificationEmail = NewVerificationEmail & {
	created_at: Datelike;
};
