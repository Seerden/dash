import { TRPCError } from "@trpc/server";

export const ERRORS = {
	INVALID_CREDENTIALS: new TRPCError({
		code: "UNAUTHORIZED",
		message: "Invalid credentials.",
	}),
	ALREADY_LOGGED_IN: new TRPCError({
		code: "UNAUTHORIZED",
		message: "Can't create a new account, because you're already logged in.",
	}),
	REGISTRATION_FAILED: new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to register new user.",
	}),
	ACTIVATION_FAILED: new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to activate user account.",
	}),
	USER_NOT_FOUND: new TRPCError({
		code: "NOT_FOUND",
		message: "User not found.",
	}),
};
