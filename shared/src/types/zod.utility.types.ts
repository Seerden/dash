import type { Dayjs } from "dayjs";
import { z } from "zod/v4";
import day from "../lib/datetime/day";

export { z };

/** Instead of typing z.<whatever> over and over and over, let's create some
 * utility functions */

export const string = z.string();
export const stringArray = z.array(string);
export const nullableString = z.nullable(z.string());
export const arrayOfNullableStrings = z.array(nullableString);
export const nullableArrayOfNullableStrings = z.nullable(
	arrayOfNullableStrings
);

export const datelike = z.union([z.date(), z.string(), z.number()]);

export const timestampSchema = z.union([
	z.string(),
	z.instanceof(Date),
	/** @see https://github.com/colinhacks/zod/discussions/1259#discussioncomment-3954250 */
	z.instanceof(day as unknown as typeof Dayjs),
	z.number(),
]);
export type Timestamp = z.infer<typeof timestampSchema>;

/** Things that are stored as numeric(x, n), we usually want to parse to
 * numbers. This accomplishes that. */
export const numeric = (num: number) =>
	z.preprocess(
		(value) => (typeof value === "string" ? +(+value).toFixed(num) : value),
		z.union([z.number(), z.string()])
	);
