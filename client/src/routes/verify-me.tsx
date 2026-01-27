import { z } from "@shared/types/zod.utility.types";
import { createFileRoute } from "@tanstack/react-router";
import VerifyMe from "@/components/auth/account-verification/VerifyMe";

// TODO: put validators in @lib
export const verifyMeSearchSchema = z.object({
	token: z.string(),
	username: z.string().min(3),
});

export type VerifyMeSearch = z.infer<typeof verifyMeSearchSchema>;

export const Route = createFileRoute("/verify-me")({
	component: VerifyMe,
	validateSearch(search) {
		return verifyMeSearchSchema.parse(search);
	},
});
