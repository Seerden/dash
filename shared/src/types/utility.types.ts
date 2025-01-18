export type Nullable<T> = T | null;

/** IDs in our database are represented by bigints, which postgres.js interprets
 * as strings. */
export type ID = string;
