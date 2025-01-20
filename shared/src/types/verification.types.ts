import { userSchema } from "@shared/types/user.types";
import { z } from "zod";

export const accountVerificationSchema = z.object({
	token: z.string(),
	...userSchema.pick({ username: true }).shape,
});
