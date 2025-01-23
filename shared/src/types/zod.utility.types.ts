import { z } from "zod";

/** Instead of typing z.<whatever> over and over and over, let's create some
 * utility functions */

export const string = z.string();
export const stringArray = z.array(string);
export const nullableString = z.nullable(z.string());
export const arrayOfNullableStrings = z.array(nullableString);
export const nullableArrayOfNullableStrings = z.nullable(
	arrayOfNullableStrings,
);

export const datelike = z.union([z.date(), z.string(), z.number()]);

/** Things that are stored as numeric(x, n), we usually want to parse to
 * numbers. This accomplishes that. */
export const numeric = (num: number) =>
	z.preprocess(
		(value) => (typeof value === "string" ? +(+value).toFixed(num) : value),
		z.union([z.number(), z.string()]),
	);
