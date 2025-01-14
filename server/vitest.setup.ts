import "dotenv/config";
import { afterAll, beforeAll } from "vitest";
import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext) {
	beforeAll(() => {
		// do stuff
	});

	afterAll(() => {
		// do stuff
	});
}
