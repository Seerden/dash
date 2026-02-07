import type { Dayjs } from "dayjs";

export type Nullable<T> = T | null;

/** IDs in our database are represented by bigints, which postgres.js interprets
 * as strings. */
export type ID = string;

export type Maybe<T> = T | null | undefined;

/**
 * Omit that only works with keys actually present in the object.
 * @see https://github.com/microsoft/TypeScript/issues/30825#issuecomment-673002409 */

// biome-ignore lint/suspicious/noExplicitAny: this just works
export type OmitStrict<T, K extends keyof T> = T extends any
	? Pick<T, Exclude<keyof T, K>>
	: never;

export type Datelike = string | Date | number | Dayjs;
