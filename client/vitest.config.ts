import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ["**/*.test.ts", "**/*.test.tsx"],
			globals: true,
			environment: "jsdom",
			setupFiles: ["./vitest.setup.ts"]
		}
	})
);
