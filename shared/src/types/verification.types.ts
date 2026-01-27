import { userSchema } from "./user.types";
import { z } from "./zod.utility.types";

export const accountVerificationSchema = z.object({
	token: z.string(),
	...userSchema.pick({ username: true }).shape,
});
