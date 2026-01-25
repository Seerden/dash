/**
 * I've adapted this slightly from my old jest setup file, so I don't know what
 * does and doesn't _have_ to be in here to work properly. As long as nothing
 * breaks, don't worry about it. Same goes for render-utils.
 */

import "whatwg-fetch";

import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(matchers);

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

afterEach(() => {
	cleanup();
});
