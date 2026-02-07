import { TRADES_TABLES } from "@shared/types/table.types";
import type { Ticket } from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

/** Delete one or more tickets from the database. */
export const deleteTickets = query(async (sql, { ids }: { ids: string[] }) => {
	if (!ids?.length) {
		return;
	}

	const uniqueIds = Array.from(new Set(ids));
	const deletedTickets = await sql<Ticket[]>`
      delete from ${sql(TRADES_TABLES.tickets)}
      where id = any(${uniqueIds})
      returning *
   `;

	if (deletedTickets.length !== uniqueIds.length) {
		throw new Error(
			`deleteTrades: rolling back; could not delete all trades given ids ${ids}`
		);
	}

	return deletedTickets;
});
