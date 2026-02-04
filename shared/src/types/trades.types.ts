import { timestampSchema, z } from "./zod.utility.types";

export const ticketSideSchema = z.enum(["SS", "S", "BC", "B"]);
export type TicketSide = z.infer<typeof ticketSideSchema>;

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

export const tradeSchema = tradeInputSchema.and(
	z.object({
		id: z.string(),
		created_at: timestampSchema,
		updated_at: timestampSchema,
	})
);
export type Trade = z.infer<typeof tradeSchema>;

export const ticketInputSchema = z.object({
	account: z.string(),
	timestamp: timestampSchema, // TODO: what does the postgresjs return for timestamptz columns?
	ticker: z.string(),
	amount: z.number(),
	side: ticketSideSchema,
	price: z.number(),
});
export type TicketInput = z.infer<typeof ticketInputSchema>;

export const ticketInputWithTradeIdSchema = ticketInputSchema.and(
	z.object({
		trade_id: z.string(),
	})
);

export const ticketSchema = ticketInputWithTradeIdSchema.and(
	z.object({
		id: z.string(),
	})
);
export type Ticket = z.infer<typeof ticketSchema>;

export const tradeMetaInputSchema = z.object({
	account: z.string(),
	ticker: z.string(),
	ticket_id: z.string().nullable(),
	timestamp: timestampSchema, // TODO: see ticketSchema.timestamp note
	data: z.record(z.string(), z.any()).nullable(),
	stop: z.number().nullable(),
	target: z.number().nullable(),
});

export const tradeMetaSchema = tradeMetaInputSchema.and(
	z.object({
		id: z.string(),
		created_at: timestampSchema,
		updated_at: timestampSchema,
	})
);
