import "dotenv/config";
import postgres from "postgres";

const {
	PG_USER,
	PG_PASS,
	PG_DB,
	DB_HOST,
	PG_PORT,
	PG_TEST_PORT,
	PG_TEST_DB,
	DB_TEST_HOST,
	IS_TEST_ENVIRONMENT,
} = process.env;

// I don't know what generic this expects. postgres.js is not very
// typescript-oriented.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PostgresOptions = postgres.Options<any>;

const options: PostgresOptions = {
	host: DB_HOST,
	user: PG_USER,
	pass: PG_PASS,
	database: PG_DB,
	port: +(PG_PORT ?? 5432),
};

const testOptions: PostgresOptions = {
	host: DB_TEST_HOST,
	user: PG_USER,
	pass: PG_PASS,
	database: PG_TEST_DB,
	port: +(PG_TEST_PORT ?? 5434),
};

export const sqlConnection = postgres(
	IS_TEST_ENVIRONMENT === "true" ? testOptions : options,
);

export const DEV_sqlTestConnection = postgres(testOptions);

export async function tryPingingDatabase() {
	let tries = 0;
	const delays = [0, 5000, 10000, 15000];

	while (tries < 3) {
		try {
			console.log("Trying to ping database...", { tries });
			await new Promise((resolve) => setTimeout(resolve, delays[tries]));
			await pingDatabase();
			return; // do not continue after ping is successful.
		} catch (error) {
			console.error({
				message: "Error pinging database",
				...Object.entries(error.errors), // .errors should be available if there was a database error.
			});
		} finally {
			tries++;
		}
	}
}

export async function pingDatabase() {
	try {
		const [result] = await sqlConnection`SELECT array[1]`;
		if (!result) {
			throw new Error("Error connecting to database");
		}
		console.log({ result });
	} catch (error) {
		// TODO: Add Sentry logging
		console.log({
			error: error.errors,
			message: "Error connecting to database",
			env: process.env,
		});
	}
}
