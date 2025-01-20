import { sqlConnection } from "@/db/init";
import { insertEmail } from "@/lib/data/models/email/insert-email";
import { generateEntityId } from "@/lib/resend/domain";
import { resend } from "@/lib/resend/resend";
import { emailSchema } from "@shared/types/email.types";
import type { CreateEmailOptions, CreateEmailRequestOptions } from "resend";
import type { SQL } from "types/utility.types";

/** Use the resend API to send a transactional email. */
export async function sendEmail({
	sql = sqlConnection,
	payload,
	options = {},
}: {
	sql?: SQL;
	payload: CreateEmailOptions;
	options?: CreateEmailRequestOptions;
}) {
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

	// store the email in the database, since the free tier of Resend only
	// stores emails for a very short period of time.
	if (data?.id) {
		const email = await getEmailById(data.id);
		return await insertEmail({ sql, email });
	}

	throw new Error("Resend did not return an email ID.");
}

/** Gets a single email from resend.
 * @note because of the limitationg of the free tier of Resend, we need to store
 * emails in our own database so we can refer to them later. We have a limited
 * number of emails we can send, and Resend stores them for a very short period,
 * so don't test this function directly by sending a mock email and retrieving
 * it, for example.
 */
export async function getEmailById(emailId: string) {
	const { data } = await resend.emails.get(emailId);
	return emailSchema.parse(data);

	// should throw here. If we're here, the shape of the response from Resend
	// probably changed.
}
