import { ticketSideSchema } from "types/trades.types";
import { timestampSchema, z } from "./zod.utility.types";

export const ticketInputSchema = z.object({
	account: z.string(),
	timestamp: timestampSchema, // TODO: what does the postgresjs return for timestamptz columns?
	ticker: z.string(),
	amount: z.number(),
	side: ticketSideSchema,
	price: z.number(),
});
export type TicketInput = z.infer<typeof ticketInputSchema>;

export const updateTicketInputSchema = ticketInputSchema.and(
	z.object({
		id: z.string(),
	})
);
export type UpdateTicketInput = z.infer<typeof updateTicketInputSchema>;

export const updateTicketInsertSchema = updateTicketInputSchema.and(
	z.object({
		updated_at: z.date(),
	})
);
export type UpdateTicketInsert = z.infer<typeof updateTicketInsertSchema>;

export const ticketInputWithTradeIdSchema = ticketInputSchema.and(
	z.object({
		trade_id: z.string(),
	})
);

export const tradeInputSchema = z.object({
	account: z.string(),
	ticker: z.string(),
	realized: z.number(),
	unrealized: z.number().nullable(),
	/** trade duration in seconds */
	duration: z.number().nullable(),
	closed: z.boolean().default(false),
});
export type TradeInput = z.infer<typeof tradeInputSchema>;

export const updateTradeInputSchema = tradeInputSchema.and(
	z.object({
		id: z.string(),
	})
);
export type UpdateTradeInput = z.infer<typeof updateTradeInputSchema>;

export const updateTradeInsertSchema = updateTradeInputSchema.and(
	z.object({
		updated_at: z.date(),
	})
);
export type UpdateTradeInsert = z.infer<typeof updateTradeInsertSchema>;

export const tradeMetaInputSchema = z.object({
	account: z.string(),
	ticker: z.string(),
	ticket_id: z.string().nullable(),
	timestamp: timestampSchema, // TODO: see ticketSchema.timestamp note
	data: z.record(z.string(), z.any()).nullable(),
	stop: z.number().nullable(),
	target: z.number().nullable(),
});
export type TradeMetaInput = z.infer<typeof tradeMetaInputSchema>;

export const updateTradeMetaInputSchema = tradeMetaInputSchema.and(
	z.object({
		id: z.string(),
	})
);
export type UpdateTradeMetaInput = z.infer<typeof updateTradeMetaInputSchema>;
