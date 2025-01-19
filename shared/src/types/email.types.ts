import { z } from "zod";
import {
	nullableArrayOfNullableStrings,
	stringArray,
} from "./zod.utility.types";

/** Validator for the `emails` table. */
export const emailSchema = z.object({
	object: z.string(),
	id: z.string(),
	to: stringArray,
	from: z.string(),
	created_at: z.string(),
	subject: z.string(),
	bcc: nullableArrayOfNullableStrings,
	cc: nullableArrayOfNullableStrings,
	reply_to: nullableArrayOfNullableStrings,
	last_event: z.string(),
	html: z.string(),
	text: z.nullable(z.string()),
	scheduled_at: z.nullable(z.string()),
});

export type Email = z.infer<typeof emailSchema>;
