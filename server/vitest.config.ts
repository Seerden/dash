import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		include: ["**/*.test.ts", "**/*.test.tsx"],
		globals: true,
		passWithNoTests: true,
		environment: "node",
		setupFiles: ["./dotenv-config.ts", "./vitest.setup.ts"],
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
			"@shared": fileURLToPath(new URL("../shared/src", import.meta.url)),
			types: fileURLToPath(new URL("./types", import.meta.url)),
			// vitest.setup.ts needs @server to be available, because it can't
			// import using `@/db` for example, I think because of where it's
			// located.
			"@server": fileURLToPath(new URL("../server/src", import.meta.url)),
		},
	},
});
