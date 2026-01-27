import type { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { Maybe } from "@shared/types/utility.types";
import { stat } from "fs/promises";
import { aggsFilenameToYMD } from "@/lib/polygon/flatfiles/queue/parse-filename";
import { createTransaction, query } from "@/lib/query-function";

export type InsertFromCsvArgs = {
	/** The filename of the csv file to insert. It should live in the /flatfiles folder. */
	filename: string;
	/** Optionally specify the name to use for the temp table, in case the
	 * filename doesn't evaluate to YearMonthDay. */
	tableName?: string;
	/** Optionally return the number of inserted rows. This takes nonzero time to
	 * process, so leave it out when bulk inserting to save some time. */
	returnCount?: boolean;
	/** The table to insert the data into, restricted to either price_action_1d
	 * or price_action_1m currently. */
	targetTable: PRICE_ACTION_TABLES;
};

/** Check if the provided filename represents a gzipped file. */
function isGzippedFile(filename: string): boolean {
	return filename.endsWith(".gz");
}

/** Create a temporary price_action table
 * @usage extract flatfiles CSV data into this. */
const createTempTable = query(
	async (
		sql,
		{
			tempTableName,
		}: {
			tempTableName: string;
		}
	) => {
		await sql`
   -- this temp table matches the shape of the flatfiles csv files
   CREATE TEMP TABLE if not exists ${sql(tempTableName)} (
      ticker         varchar(16),
      volume         numeric(14,2),
      open           numeric(16,6),
      close          numeric(16,6),
      high           numeric(16,6),
      low            numeric(16,6),
      window_start   bigint,
      transactions   integer
   );
`;
	}
);

/** Copy a flatfiles csv file into the given temporary price action table. */
const copyCsvToTempTable = query(
	async (
		sql,
		{
			containerFilePath,
			tempTableName,
			isGzipped,
		}: {
			containerFilePath: string;
			isGzipped: boolean;
			tempTableName: string;
		}
	) => {
		const fromString = isGzipped
			? `FROM PROGRAM 'gzip -dc ${containerFilePath}'`
			: `FROM '${containerFilePath}'`;

		// Copies the csv data into the assigned temporary table.
		// NOTE: this uses an unsafe query because I can't get the COPY command to
		// work with a parameter for the filename.
		await sql.unsafe(`
      COPY ${tempTableName}(ticker, volume, open, close, high, low, window_start, transactions)
      ${fromString}
      DELIMITER ','
      CSV HEADER;
   `);
	}
);

/** Copy all data from the given temporary table into the assigned price action
 * table. */
const copyFromTempTableToMainTable = query(
	async (
		sql,
		{
			returnCount,
			tempTableName,
			targetTable,
		}: {
			returnCount?: boolean;
			tempTableName: string;
			targetTable: `${PRICE_ACTION_TABLES}`;
		}
	) => {
		const alias = `inserted_rows`;
		const maybeReturningTicker = returnCount ? sql`RETURNING ticker` : sql``;
		const maybeSelectCount = returnCount
			? sql`SELECT count(*) as count FROM ${alias}`
			: sql`SELECT NULL as count`;

		const inserted: Maybe<{ count: number }> = await sql<[{ count: number }]>`
      WITH ${sql(alias)} AS (
         INSERT INTO ${sql(targetTable)} 
            ("ticker", "timestamp", "open", "close", "high", "low", "volume")
         SELECT
            ticker,
            to_timestamp(window_start / 1e9) as "timestamp", -- window_start is in nanoseconds
            "open",
            "close",
            high,
            low,
            volume
         FROM
            ${sql(tempTableName)}
         ${maybeReturningTicker}
      )
      ${maybeSelectCount}
   `;

		return inserted?.count;
	}
);

/** Drop the given temporary price action table. */
const dropTempTable = query(
	async (
		sql,
		{
			tempTableName,
		}: {
			tempTableName: string;
		}
	) => {
		await sql`DROP TABLE IF EXISTS ${sql(tempTableName)};`;
	}
);

/** This takes an uncompressed or gzipped csv file, transforms the polygon data
 * inside it and inserts it into the database as PriceAction rows.
 * @todo tests
 */
export const insertAggsFromCsv = query(
	async ({
		filename,
		tableName,
		targetTable,
		returnCount = false,
	}: InsertFromCsvArgs) => {
		return await createTransaction(async (sql) => {
			// NOTE: this must match the path we bind the volume to in compose.yml
			const containerFilePath = `/var/lib/postgresql/flatfiles/${filename}`;

			const csvExists = (await stat(`/dash/flatfiles/${filename}`)).isFile();

			if (!csvExists) {
				throw new Error(`CSV file ${filename} does not exist.`);
			}

			const isGzipped = isGzippedFile(filename);
			const { year, month, day } = aggsFilenameToYMD(filename);

			const tempTableName = tableName
				? `price_action_temp_${tableName}`
				: `price_action_temp_${year}${month}${day}`;

			await createTempTable({ tempTableName });
			await copyCsvToTempTable({ tempTableName, containerFilePath, isGzipped });
			const insertedCount = await copyFromTempTableToMainTable({
				tempTableName,
				targetTable,
				returnCount,
			});
			await dropTempTable({ tempTableName });
			const count = insertedCount;

			return count;
		});
	}
);
