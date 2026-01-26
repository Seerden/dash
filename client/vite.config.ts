import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	// TODO: PWA stuff
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			quoteStyle: "double",
		}),
		react(),
		tsconfigPaths(),
		visualizer(),
	],
	build: {
		minify: "esbuild",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@components": fileURLToPath(
				new URL("./src/components", import.meta.url)
			),
			"@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
			"@shared": fileURLToPath(new URL("../shared/src", import.meta.url)),
			"@server": fileURLToPath(new URL("../server/src", import.meta.url)),
		},
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
	},
	server: {
		host: true,
		port: 5175,
		watch: {
			usePolling: true,
		},
	},
});
