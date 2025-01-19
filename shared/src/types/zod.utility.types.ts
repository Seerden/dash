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
