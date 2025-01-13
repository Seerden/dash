import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../client/src"),
			"@lib": path.resolve(__dirname, "../client/src/lib"),
			"@components": path.resolve(__dirname, "../client/src/components"),
			"@t": path.resolve(__dirname, "../shared/types")
		},
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
	},
	server: {
		port: 5175,
		watch: {
			usePolling: true
		}
	}
});
