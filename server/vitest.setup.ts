import scriptCache from "@server/db/scripts/script.cache";
import { afterAll, beforeAll } from "vitest";
import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext) {
	beforeAll(async () => {
		await scriptCache.synchronize();
	});

	afterAll(() => {
		// do stuff
	});
}
