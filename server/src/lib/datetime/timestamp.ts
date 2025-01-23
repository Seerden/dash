import type { Datelike } from "@shared/types/utility.types";

/** Takes a Datelike and returns the unix millisecond timestamp for it.
 * @todo test this once we've implemented more functionality to test it with. */
export function toTimestamp(timestamp: Datelike) {
	return new Date(timestamp).valueOf();
}
