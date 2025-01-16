const esbuild = require("esbuild");

const dependencies = Object.keys(require("./package.json").dependencies);
const devDependencies = Object.keys(require("./package.json").devDependencies);

esbuild
	.build({
		entryPoints: ["./src/index.ts"], // Entry point for your Node.js application
		outfile: "./dist/server.js", // Output location and file
		bundle: true, // Bundle all dependencies
		platform: "node", // Target environment (Node.js)
		target: "esnext", // Set Node.js version (adjust if needed)
		format: "esm",
		sourcemap: false, // Optionally include sourcemaps
		minify: true, // Minify the output
		// external: ['some-package'],    // Externalize any dependencies you
		// don't want bundled (e.g., native modules)
		external: [...dependencies, ...devDependencies],
	})
	.catch(() => process.exit(1));
