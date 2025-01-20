import { userWithoutPasswordSchema, type User } from "@shared/types/user.types";

export function stripSensitiveUserData(user: User) {
	if (!user) return;

	const { password_hash, ...strippedUser } = user;

	return userWithoutPasswordSchema.parse(strippedUser);
}
