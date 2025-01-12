import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../client/src"),
			"@lib": path.resolve(__dirname, "../client/src/lib"),
			"@components": path.resolve(__dirname, "../client/src/components"),
			"@shared": path.resolve(__dirname, "../shared/src")
		},
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
	},
	server: {
		watch: {
			usePolling: true
		}
	}
});
