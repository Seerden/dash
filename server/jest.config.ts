/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

import { pathsToModuleNameMapper } from "ts-jest";
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import * as json from "./tsconfig.json";

module.exports = {
	preset: "ts-jest",
	roots: ["<rootDir>"],
	testEnvironment: "node",
	modulePaths: [json.compilerOptions.baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(
		json.compilerOptions.paths /*, { prefix: '<rootDir>/' } */,
	),
};
