import { TRADES_TABLES } from "@shared/types/table.types";
import {
	type Ticket,
	type TicketInput,
	ticketSchema,
} from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

/** #dash/trades/CRUD:
 * - don't forget to update updated_at
 */
export const updateTickets = query(
	async (sql, { tickets }: { tickets: TicketInput[] }) => {
		const parsed = ticketSchema.array().min(1).safeParse(tickets);
		// check if the input is valid; use ticketSchema.parse
		if (!parsed.success) {
			// TODO: throw a trpc error.
			return;
		}

		const response = await sql<Ticket[]>`
         update ${sql(TRADES_TABLES.tickets)} 
         set ${sql(parsed.data.map((d) => ({ ...d, updated_at: new Date() })))}
         returning *
      `;

		return response;
	}
);
