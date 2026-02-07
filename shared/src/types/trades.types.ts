import {
	ticketInputSchema,
	ticketInputWithTradeIdSchema,
	tradeInputSchema,
	tradeMetaInputSchema,
} from "types/trades.input.types";
import { timestampSchema, z } from "./zod.utility.types";

export const ticketSideSchema = z.enum(["SS", "S", "BC", "B"]);
export type TicketSide = z.infer<typeof ticketSideSchema>;

export const tradeSchema = tradeInputSchema.and(
	z.object({
		id: z.string(),
		created_at: timestampSchema,
		updated_at: timestampSchema,
	})
);
export type Trade = z.infer<typeof tradeSchema>;

export const ticketInsertSchema = ticketInputSchema.and(
	z.object({
		trade_id: z.string(),
	})
);
// TODO: use this in createTickets instead of A & B
export type TicketInsert = z.infer<typeof ticketInsertSchema>;

export const ticketSchema = ticketInputWithTradeIdSchema.and(
	z.object({
		id: z.string(),
	})
);
export type Ticket = z.infer<typeof ticketSchema>;

export const tradeMetaSchema = tradeMetaInputSchema.and(
	z.object({
		id: z.string(),
		created_at: timestampSchema,
		updated_at: timestampSchema,
	})
);
