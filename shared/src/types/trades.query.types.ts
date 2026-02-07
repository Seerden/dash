import { z } from "types/zod.utility.types";

export const queryTicketsSchema = z.object({
	ids: z.string().array().optional(),
	tickers: z.string().array().optional(),
	trade_id: z.string().optional(),
});
export type QueryTickets = z.infer<typeof queryTicketsSchema>;

export const queryTradesSchema = z.object({
	tickers: z.string().array().optional(),
	ids: z.string().array().optional(),
	open: z.boolean().optional(),
});
export type QueryTrades = z.infer<typeof queryTradesSchema>;

export const queryTradesMetaSchema = z.object({
	ids: z.string().array(),
});
export type QueryTradesMeta = z.infer<typeof queryTradesMetaSchema>;
