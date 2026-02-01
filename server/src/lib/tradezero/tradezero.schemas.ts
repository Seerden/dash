import { z } from "@shared/types/zod.utility.types";

/** schema to match the shape of trade tickets in TradeZero account .pdfs. */
export const tradeZeroPdfTicketSchema = z.object({
	tradeDate: z.string(),
	settlementDate: z.string(),
	currency: z.string(),
	type: z.string(),
	side: z.string(),
	symbol: z.string(),
	quantity: z.number(),
	price: z.number(),
	commission: z.number(),
	secFee: z.number(),
	tafFee: z.number(),
	nsccFee: z.number(),
	nasdaqFee: z.number(),
	grossProceeds: z.number(),
	netProceeds: z.number(),
});

export type TradeZeroPdfTicket = z.infer<typeof tradeZeroPdfTicketSchema>;
