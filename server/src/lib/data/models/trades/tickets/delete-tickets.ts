import { TRADES_TABLES } from "@shared/types/table.types";
import type { Ticket } from "@shared/types/trades.types";
import { query } from "@/lib/query-function";

/** Delete one or more tickets from the database. */
export const deleteTickets = query(async (sql, { ids }: { ids: string[] }) => {
	if (!ids?.length) {
		return;
	}

	return await sql<Ticket[]>`
      delete from ${sql(TRADES_TABLES.tickets)}
      where id = any(${ids})
      returning *
   `;
});
