import { parse } from "csv-parse";
import fs from "fs";

const CHUNK_SIZE = 9000; // Number of rows per chunk

export async function getColumnsAndFirstRow(filePath: string) {
	const parser = fs
		.createReadStream(filePath)
		.pipe(parse({ columns: false, toLine: 2 }));
	for await (const [record, index] of parser) {
		// if columns: false, the first record will be an array containing the
		// column names, and all subsequent records will be arrays containing the
		// values for each row. If columns: true, each record will be a key-value
		// pair, where the keys are the column names.
		console.log({ record });
	}
}

async function processCSV(filePath: string) {
	const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));
	let buffer = [];

	for await (const record of parser) {
		buffer.push(record); // Add the current row to the buffer

		if (buffer.length === CHUNK_SIZE) {
			// Process the chunk
			console.log(`Processing chunk of size: ${buffer.length}`);
			await processChunk(buffer);

			// Clear the buffer
			buffer = [];
		}
	}

	// Process any remaining rows
	if (buffer.length > 0) {
		console.log(`Processing final chunk of size: ${buffer.length}`);
		await processChunk(buffer);
	}

	console.log("Finished processing file.");
}

async function processChunk(chunk: any) {
	// Your logic to process the chunk (e.g., save to DB, transform data, etc.)
	console.log(`Chunk contains ${chunk.length} rows.`);
}

// Call the function with the file path
// processCSV("large-file.csv").catch((err) => {
// 	console.error("Error processing CSV:", err);
// });
