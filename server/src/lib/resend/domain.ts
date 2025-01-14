import { resend } from "@/lib/resend/resend";

/** Query the Resend API for our API keys. */
export async function getApiKeys() {
	return resend.apiKeys.list();
}

/** Used this for testing to see if emails send successfully. */
export async function DEV_sendTestEmail() {
	const { data, error } = await resend.emails.send({
		from: "Admin <test@auth.seerden.dev>",
		to: ["christiaanseerden@live.nl"],
		subject: "Hello, world",
		html: "<h1>Hello, world</h1>",
	});

	console.log({ data, error });
}

export function generateEntityId() {
	const id = Math.random().toString(36);

	return {
		"X-Entity-Ref-ID": id,
	};
}
