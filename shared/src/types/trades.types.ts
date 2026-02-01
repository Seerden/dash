import { timestampSchema, z } from "./zod.utility.types";

export const ticketSideSchema = z.enum(["SS", "S", "BC", "B"]);
export type TicketSide = z.infer<typeof ticketSideSchema>;

export const tradeSchema = z.object({
	id: z.string(),
	account: z.string(),
	ticker: z.string(),
	realized: z.number(),
	unrealized: z.number().nullable(),
	/** trade duration in seconds */
	duration: z.number().nullable(),
	closed: z.boolean(),
	created_at: timestampSchema,
	updated_at: timestampSchema,
});
export type Trade = z.infer<typeof tradeSchema>;

export const ticketSchema = z.object({
	id: z.string(),
	account: z.string(),
	trade_id: z.string(),
	timestamp: timestampSchema, // TODO: what does the postgresjs return for timestamptz columns?
	ticker: z.string(),
	amount: z.number(),
	side: ticketSideSchema,
	price: z.number(),
});

export const tradeMetaSchema = z.object({
	id: z.string(),
	account: z.string(),
	ticker: z.string(),
	ticket_id: z.string().nullable(),
	timestamp: timestampSchema, // TODO: see ticketSchema.timestamp note
	data: z.record(z.string(), z.any()).nullable(),
	stop: z.number().nullable(),
	target: z.number().nullable(),
	created_at: timestampSchema,
	updated_at: timestampSchema,
});
