/** Generates a UUID that we can use as email verification token. */
export function generateEmailVerificationToken() {
	return crypto.randomUUID();
}
