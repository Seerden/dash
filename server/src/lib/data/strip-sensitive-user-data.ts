import { userWithoutPasswordSchema, type User } from "@shared/types/user.types";
import type { Maybe } from "@shared/types/utility.types";

export function stripSensitiveUserData(user: Maybe<User>) {
	if (!user) return;
	const { password_hash, ...strippedUser } = user;

	return userWithoutPasswordSchema.parse(strippedUser);
}
