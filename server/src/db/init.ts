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

// I don't know what the point of the generic is here, leave it as any.
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

export const sqlConnection = postgres(IS_TEST_ENVIRONMENT ? testOptions : options);
export const DEV_sqlTestConnection = postgres(testOptions);

export async function pingDatabase() {
	try {
		const [result] = await sqlConnection`SELECT array[1]`;
		if (!result) {
			throw new Error("Error connecting to database");
		}
	} catch (error) {
		// TODO: Add Sentry logging
		console.log({ error, message: "Error connecting to database" });
	}
}
