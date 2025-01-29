import { sqlConnection } from "@/db/init";
import type {
	PriceAction,
	PriceActionWithUpdatedAt,
} from "@shared/types/price-action.types";
import { priceActionWithUpdatedAtSchema } from "@shared/types/price-action.types";
import { PRICE_ACTION_TABLES } from "@shared/types/table.types";
import { type QueryFunction } from "types/utility.types";

/** Insert a number of price action entries into the database.
 * @todo once we implement more tables, we need to adjust this function to be
 * able to insert into those. */
const insertPriceActionSet: QueryFunction<
	{ priceAction: PriceAction[] },
	PriceActionWithUpdatedAt[]
> = async ({ sql = sqlConnection, priceAction }) => {
	return await sql<[PriceActionWithUpdatedAt]>`
      INSERT INTO ${sql(PRICE_ACTION_TABLES.DAILY)} ${sql(priceAction)}
      ON CONFLICT (ticker, timestamp) DO NOTHING
      RETURNING *
   `;
};

/** Insert any number of price action entries in the database, but split the
 * calls up to fit the postgres parameter limit.
 * @note make sure to always run this inside a transaction! It allows us to
 * properly unit test this function. */
export const insertPriceAction: QueryFunction<
	{ priceAction: PriceAction[] },
	PriceActionWithUpdatedAt[]
> = async ({ sql = sqlConnection, priceAction }) => {
	// TODO: extract this functionality into a generic bulkInsert function,
	// because we may need it later for other tables.
	// postgres parameter limit is 2**16 - 1, so split the data up to make each
	// bulk insert barely fit within the limit.
	const size = 9250;
	const setCount = Math.ceil(priceAction.length / size);

	await sql`savepoint insert_price_action`; // this is the savepoint we roll back to from the test when it's done

	const queries = Array.from({ length: setCount }).map(async (_, i) => {
		return insertPriceActionSet({
			sql,
			priceAction: priceAction.slice(i * size, (i + 1) * size),
		});
	});

	return (await Promise.all(queries))
		.flat()
		.map((row) => priceActionWithUpdatedAtSchema.parse(row));
};
