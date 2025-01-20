import { verificationEmailSentMessage } from "@/lib/trpc/resolvers/constants/messages";
import { RESPONSE_STATUS } from "@/lib/trpc/resolvers/constants/status";

export const verificationEmailSentResponse = {
	status: RESPONSE_STATUS.SUCCESS,
	message: verificationEmailSentMessage,
};

export const logoutResponse = {
	success: true,
};
