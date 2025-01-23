import type { Datelike } from "@shared/types/utility.types";

/** Takes a Datelike and returns the unix millisecond timestamp for it. */
export function toTimestamp(timestamp: Datelike) {
	return new Date(timestamp).valueOf();
}
