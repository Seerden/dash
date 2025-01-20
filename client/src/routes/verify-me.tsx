import VerifyMe from "@/components/auth/account-verification/VerifyMe";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// TODO: put validators in @lib
export const verifyMeSearchSchema = z.object({
	token: z.string(),
	username: z.string().min(3)
});

export type VerifyMeSearch = z.infer<typeof verifyMeSearchSchema>;

export const Route = createFileRoute("/verify-me")({
	component: VerifyMe,
	validateSearch(search) {
		return verifyMeSearchSchema.parse(search);
	}
});
