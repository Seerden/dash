import { sqlConnection } from "@/db/init";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import type { SQL } from "types/utility.types";

type InsertFromCsvArgs = {
	/** The SQL connection to use. */
	sql?: SQL;
	/** The filename of the csv file to insert. It should live in the /flatfiles folder. */
	filename: string;
	/** Optionally specify the name to use for the temp table, in case the
	 * filename doesn't evaluate to YearMonthDay. */
	tableName?: string;
	/** Optionally return the number of inserted rows. This takes nonzero time to
	 * process, so leave it out when bulk inserting to save some time. */
	returnCount?: boolean;
};

/** This takes an uncompressed or gzipped csv file, transforms the polygon data
inside it and inserts it into the database as PriceAction rows. */
export async function insertFromCsv({
	sql = sqlConnection,
	filename,
	tableName,
	returnCount = false,
}: InsertFromCsvArgs) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const filepath = filename.split("/").at(-1)!;
	const isGzipped = filename.endsWith(".gz");
	const [year, month, day] = filepath.split(".")[0].split("-");
	const tempTableName = tableName
		? `price_action_temp_${tableName}`
		: `price_action_temp_${year}${month}${day}`;

	const count = await sql.begin(async (q) => {
		// First, create a temporary table to put the raw csv data into.
		await q`
         -- this temp table matches the shape of the flatefiles csv files
         CREATE TEMP TABLE if not exists ${q(tempTableName)} (
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

		// this needs to match the path we bind the volume to in the compose.yml
		const containerFilePath = `/var/lib/postgresql/flatfiles/${filename}`;

		// Copies the csv data into the temporary table.
		// NOTE: this uses an unsafe query because I can't get the COPY command to
		// work with a parameter for the filename.
		await q.unsafe(`
         COPY ${tempTableName}(ticker, volume, open, close, high, low, window_start, transactions)
         ${
				isGzipped
					? `
                  FROM PROGRAM 'gzip -dc ${containerFilePath}'
               `
					: `
                  FROM '${containerFilePath}'
               `
			}
         DELIMITER ','
         CSV HEADER;
      `);

		let insertedCount: undefined | { count: number };

		if (returnCount) {
			const [insertedCount] = await q<[{ count: number }]>`
            WITH inserted_rows AS (
               INSERT INTO ${q(PRICE_ACTION_TABLES.DAILY)} 
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
                  ${q(tempTableName)}
               RETURNING ticker
            )
            SELECT count(*) as count FROM inserted_rows;         
         `;
		} else {
			await q`
            INSERT INTO ${q(PRICE_ACTION_TABLES.DAILY)} 
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
                  ${q(tempTableName)}
      `;
		}

		await q`DROP TABLE IF EXISTS ${q(tempTableName)};`;

		return insertedCount?.count;
	});

	return count;
}
