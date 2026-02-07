import type { TicketInput, TradeInput } from "@shared/types/trades.input.types";
import type { Ticket, Trade } from "@shared/types/trades.types";
import type { Nullable } from "@shared/types/utility.types";
import { insertTickets } from "@/lib/data/models/trades/tickets/create-tickets";
import { createTrades } from "@/lib/data/models/trades/trades/create-trades";

/** Does the ticket belong to a buy order? */
export function isBuy(ticket: Ticket | TicketInput) {
	return ticket.side.toLowerCase().includes("B");
}

/** Obviously, selling removes size and buying adds size. */
export function signedTicketSize(ticket: Ticket | TicketInput) {
	return ticket.amount * (isBuy(ticket) ? 1 : -1);
}

/** Build a TradeInput object with required field for a new trades. */
export function buildTradeInput({
	account,
	ticker,
}: {
	account: string;
	ticker: string;
}) {
	return {
		account,
		ticker,
		realized: 0,
		unrealized: null,
		duration: null,
		closed: false,
	} satisfies TradeInput;
}

/** Determine the final position size given a list of tickets.
 * @note this assumes all tickets belong to the same trade. */
export function cumulativeSize(tickets: Ticket[]) {
	return tickets.reduce((acc, ticket) => {
		return acc + signedTicketSize(ticket);
	}, 0);
}

/** Subroutine for createTickets that handles the creation of a single ticket
 * and provides the variables necessary for the next iteration in the loop.
 *
 * @implementation
 *  loop through tickets:
 * - check if open trade. if not, create one
 * - if belongs to this trade, add it to this trade and update
 *   the trade details (realized etc.).
 *    - check if trade is now closed.
 *     - if yes:
 *       - update the trade
 *       - create a new trade and set it to currentTrade
 *       - @todo edge case: oversized ticket that closes existing trade
 *          and also instantiates a new trade. */
export async function createTicket({
	ticket,
	currentTickets,
	currentTrade,
}: {
	ticket: TicketInput;
	currentTickets: Ticket[];
	currentTrade: Nullable<Trade>;
}) {
	if (!currentTrade) {
		currentTrade = (
			await createTrades({
				trades: [
					buildTradeInput({ account: ticket.account, ticker: ticket.ticker }),
				],
			})
		)[0];
	}

	const currentSize = cumulativeSize(currentTickets);
	const newSize = currentSize + signedTicketSize(ticket);

	const isClosingTicket =
		newSize === 0 || (currentSize !== 0 && newSize * currentSize <= 0);

	const [insertedTicket] = await insertTickets({
		tickets: [
			{
				...ticket,
				trade_id: currentTrade.id,
			},
		],
	});

	// TODO: update trade details here (realized, etc.) for both
	// cases (isClosingTicket and not)
	if (isClosingTicket) {
		currentTickets = [];
		currentTrade = null;

		return {
			nextTickets: [],
			nextTrade: null,
			insertedTicket,
		};
	} else {
		return {
			nextTickets: [...currentTickets, insertedTicket],
			nextTrade: currentTrade,
			insertedTicket,
		};
	}
}
