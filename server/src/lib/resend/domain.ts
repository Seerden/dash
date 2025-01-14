import { CreateEmailOptions, CreateEmailRequestOptions, Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(API_KEY);

// unused
export async function getApiKeys() {
	return resend.apiKeys.list();
}

// testing
export async function DEV_sendTestEmail() {
	const { data, error } = await resend.emails.send({
		from: "Admin <test@auth.seerden.dev>",
		to: ["christiaanseerden@live.nl"],
		subject: "Hello, world",
		html: "<h1>Hello, world</h1>",
	});

	console.log({ data, error });
}

function generateEntityId() {
	const id = Math.random().toString(36);

	return {
		"X-Entity-Ref-ID": id,
	};
}

export async function sendEmail({
	payload,
	options,
}: {
	payload: CreateEmailOptions;
	options: CreateEmailRequestOptions;
}) {
	try {
		const { data, error } = await resend.emails.send(
			{
				...payload,
				headers: {
					...payload.headers,
					...generateEntityId(),
				},
			},
			options,
		);
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
}
