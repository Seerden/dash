import esbuild from "esbuild";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));
const dependencies = Object.keys(packageJson.dependencies);
const devDependencies = Object.keys(packageJson.devDependencies);

/** @see https://esbuild.github.io/api/#general-options */
esbuild
	.build({
		entryPoints: ["./src/index.ts"],
		outfile: "./dist/server.js",
		bundle: true,
		platform: "node",
		target: "esnext",
		format: "esm",
		sourcemap: false,
		minify: true,
		external: [...dependencies, ...devDependencies],
	})
	.catch(() => process.exit(1));
