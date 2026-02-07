import { TRADES_TABLES } from "@shared/types/table.types";
import {
	type UpdateTicketInput,
	updateTicketInputSchema,
	updateTicketInsertSchema,
} from "@shared/types/trades.input.types";
import type { Ticket } from "@shared/types/trades.types";
import { createTransaction, query } from "@/lib/query-function";

/** Update the given tickets with the given data. */
export const updateTickets = query(
	async ({ tickets }: { tickets: UpdateTicketInput[] }) => {
		const parsed = updateTicketInputSchema.array().min(1).safeParse(tickets);

		if (!parsed.success) {
			throw new Error(
				"updateTickets: failed to parse given tickets using updateTicketInputSchema"
			);
		}

		const updateData = updateTicketInsertSchema
			.array()
			.min(1)
			.parse(
				parsed.data.map((d) => ({
					...d,
					updated_at: new Date(),
				}))
			);

		return await createTransaction(async (sql) => {
			const updatePromises = await Promise.all(
				updateData.map(async (d) => {
					const [updatedTicket] = await sql<Ticket[]>`
               update ${sql(TRADES_TABLES.tickets)}
               set ${sql(d)}
               where id = ${d.id}
            `;
					return updatedTicket;
				})
			);
			return await Promise.all(updatePromises);
		});
	}
);
