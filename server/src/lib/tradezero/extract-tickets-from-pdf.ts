import fs, { readdir } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

/** TZ put comma-separated values in values in the PDF, which will cause issues
if we want to output stuff to comma-separated csvs; so strip the commas out of
number values */
function parseCsvNumber(value: string) {
	return parseFloat(value.replace(/,/g, ""));
}

export type TradeZeroPdfTicket = {
	tradeDate: string;
	settlementDate: string;
	currency: string;
	type: string;
	side: string;
	symbol: string;
	quantity: number;
	price: number;
	commission: number;
	secFee: number;
	tafFee: number;
	nsccFee: number;
	nasdaqFee: number;
	grossProceeds: number;
	netProceeds: number;
};

/** read and parse a tradezero account document
 * @note I couldn't find proper csvs in my TZ account anymore beyond the current
 * year (and even getting that was super annoying, their date inputs are awful),
 * so I'm just using the all-inclusive account statements, which are
 * downloadable as monthly PDFs */
const pdfToCsv = async (filename: string) => {
	try {
		const dataBuffer = await fs.readFile(path.resolve("pdfs", filename));

		const parser = new PDFParse(new Uint8Array(dataBuffer));
		const data = await parser.getText();
		const textLines = data.text
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line);

		const trades: TradeZeroPdfTicket[] = [];

		// regex to match the specific date format MM-DD-YYYY at the start of a line
		// followed by the structure of the Trade Execution table.
		// regex looks for Date, Date, Currency, Type, Side, Symbol, Qty...
		// NOTE: this is actually a neat use case to ask AI something. I hate it.
		// I could probably do it manually too, since the PDFs are pretty static,
		// but this works.
		const ticketRegex =
			/^(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})\s+([A-Z]{3})\s+(\d+)\s+([A-Z]{1,2})\s+([A-Z]+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([-\d.,]+)\s+([-\d.,]+)/;

		for (const line of textLines) {
			// strip quotes and commas from the pdf
			const cleanLine = line.replace(/["],/g, " ").replace(/["]/g, "").trim();
			const match = cleanLine.match(ticketRegex);

			if (match) {
				const usableValues = match.slice(1, 7);
				const [tradeDate, settlementDate, currency, type, side, symbol] =
					usableValues;
				const toParse = match.slice(7);
				const [
					quantity,
					price,
					commission,
					secFee,
					tafFee,
					nsccFee,
					nasdaqFee,
					grossProceeds,
					netProceeds,
				] = toParse.map((value) => parseCsvNumber(value));

				const ticket: TradeZeroPdfTicket = {
					tradeDate,
					settlementDate,
					currency,
					type,
					side,
					symbol,
					quantity,
					price,
					commission,
					secFee,
					tafFee,
					nsccFee,
					nasdaqFee,
					grossProceeds,
					netProceeds,
				};

				trades.push(ticket);
			}
		}

		if (!trades.length) {
			return console.warn(
				"No tickets found in PDF. If you did make trades this month, tha means the PDF wasn't parsed properly."
			);
		}

		const header = [
			"Trade Date",
			"Settlement Date",
			"CCY",
			"Type",
			"Side",
			"Symbol",
			"Qty",
			"Price",
			"Comm",
			"SEC",
			"TAF",
			"NSCC",
			"Nasdaq",
			"Gross Proceeds",
			"Net Proceeds",
		].join(",");

		const csvRows = trades.map((t) =>
			[
				t.tradeDate,
				t.settlementDate,
				t.currency,
				t.type,
				t.side,
				t.symbol,
				t.quantity,
				t.price,
				t.commission,
				t.secFee,
				t.tafFee,
				t.nsccFee,
				t.nasdaqFee,
				t.grossProceeds,
				t.netProceeds,
			].join(",")
		);

		const csvContent = [header, ...csvRows].join("\n");
		// might as well output a json file to play around with.
		// TODO: we won't need to create either the json or the csv once the
		// database tables exist. Instead, we'll insert the tickets to the
		// database.
		const jsonContent = trades;

		const outputFile = `tickets-${filename.replace(".pdf", "")}`;
		await fs.writeFile(
			path.resolve(__dirname, "csvs", `${outputFile}.csv`),
			csvContent
		);
		await fs.writeFile(
			path.resolve(__dirname, "json", `${outputFile}.json`),
			JSON.stringify(jsonContent, null, 2)
		);
		console.log(`found and saves ${trades.length} tickets for ${outputFile}`);
	} catch (error) {
		console.error({ message: "couldn't process TradeZero PDF", error });
	}
};

try {
	const files = await readdir("./pdfs");
	for (const file of files) {
		await pdfToCsv(file);
	}
} catch (error) {
	console.error(error);
} finally {
	process.exit(1);
}
