import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		include: ["**/*.test.ts", "**/*.test.tsx"],
		globals: true,
		environment: "node",
		setupFiles: ["./vitest.setup.ts", "./dotenv-config.ts"],
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
			"@shared": fileURLToPath(new URL("../shared/src", import.meta.url)),
			types: fileURLToPath(new URL("./types", import.meta.url)),
		},
	},
});
