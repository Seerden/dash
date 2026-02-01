import fs, { readdir } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import {
	type TradeZeroPdfTicket,
	tradeZeroPdfTicketSchema,
} from "@/lib/tradezero/tradezero.schemas";

/** TZ put comma-separated values in values in the PDF, which will cause issues
if we want to output stuff to comma-separated csvs; so strip the commas out of
number values */
function cleanCsvNumber(value: string) {
	return parseFloat(value.replace(/,/g, ""));
}

/** strip quotes and commas of a line from the pdf */
function cleanCsvLine(line: string) {
	return line.replace(/["],/g, " ").replace(/["]/g, "").trim();
}

// regex to match the specific date format MM-DD-YYYY at the start of a line
// followed by the structure of the Trade Execution table.
// regex looks for Date, Date, Currency, Type, Side, Symbol, Qty...
// NOTE: this is actually a neat use case to ask AI something. I hate it.
// I could probably do it manually too, since the PDFs are pretty static,
// but this works.
const tradeZeroPdfTicketRegex =
	/^(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})\s+([A-Z]{3})\s+(\d+)\s+([A-Z]{1,2})\s+([A-Z]+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([-\d.,]+)\s+([-\d.,]+)/;

/** read and parse TradeZero account documents from the './pdfs' folder and
 * save them in .json and .csv format.
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

		const tickets: TradeZeroPdfTicket[] = [];

		for (const line of textLines) {
			const cleanLine = cleanCsvLine(line);
			const match = cleanLine.match(tradeZeroPdfTicketRegex);

			if (match) {
				const preparedValues = match.slice(1, 7);
				const [tradeDate, settlementDate, currency, type, side, symbol] =
					preparedValues;
				const unpreparedValues = match.slice(7);
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
				] = unpreparedValues.map(cleanCsvNumber);

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

				tickets.push(tradeZeroPdfTicketSchema.parse(ticket));
			}
		}

		if (!tickets.length) {
			return console.warn(
				"No tickets found in PDF. If you did make trades this month, tha means the PDF wasn't parsed properly."
			);
		}

		const fields = new Map([
			["tradeDate", "Trade Date"],
			["settlementDate", "Settlement Date"],
			["currency", "CCY"],
			["type", "Type"],
			["side", "Side"],
			["symbol", "Symbol"],
			["quantity", "Qty"],
			["price", "Price"],
			["commission", "Comm"],
			["secFee", "SEC"],
			["tafFee", "TAF"],
			["nsccFee", "NSCC"],
			["nasdaqFee", "Nasdaq"],
			["grossProceeds", "Gross Proceeds"],
			["netProceeds", "Net Proceeds"],
		]);

		const header = [...fields.values()].join(",");
		const csvRows = tickets.map((t) =>
			[...fields.keys()].map((k) => t[k as keyof TradeZeroPdfTicket]).join(",")
		);
		const csvContent = [header, ...csvRows].join("\n");

		const outputFile = `tickets-${filename.replace(".pdf", "")}`;
		await fs.writeFile(
			path.resolve(__dirname, "csvs", `${outputFile}.csv`),
			csvContent
		);

		// might as well output a json file to play around with.
		// TODO: we won't need to create either the json or the csv once the
		// database tables exist. Instead, we'll insert the tickets to the
		// database.
		await fs.writeFile(
			path.resolve(__dirname, "json", `${outputFile}.json`),
			JSON.stringify(tickets, null, 2)
		);
		console.log(`found and saved ${tickets.length} tickets for ${outputFile}`);
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
