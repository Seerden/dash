import { generateEntityId } from "@/lib/resend/domain";
import { resend } from "@/lib/resend/resend";
import { CreateEmailOptions, CreateEmailRequestOptions } from "resend";

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
					...generateEntityId(), // got this from an example in the docs, this prevents threads in gmail
				},
			},
			options,
		);
		if (error) {
			throw error;
		}

		// TODO: store the email in the database
	} catch (error) {
		console.error(error);
	}
}

/** Gets a single email from resend. */
export async function getEmailById(emailId: string) {
	const { data } = await resend.emails.get(emailId);
	return data;
}
