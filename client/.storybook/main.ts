import type { StorybookConfig } from "@storybook/react-vite";

import { dirname, join } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

	addons: [
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@chromatic-com/storybook"),
		getAbsolutePath("@storybook/addon-interactions"),
		getAbsolutePath("@storybook/addon-themes")
	],
	// Take the vite config from the client and adjust it to make HMR work.
	async viteFinal(config, { configType }) {
		const { mergeConfig } = await import("vite");
		return mergeConfig(config, {
			server: {
				host: "0.0.0.0",
				port: 6016,
				watch: {
					usePolling: true
				},
				hmr: {
					protocol: "ws",
					host: "localhost",
					port: 6016
				}
			}
		});
	},
	framework: {
		name: getAbsolutePath("@storybook/react-vite"),
		options: {}
	},
	core: {
		builder: "@storybook/builder-vite" // not sure if this is necessary, I think vite is default in storybook 8
	},
	previewHead: (head) => `
      ${head}
      <style>
			@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
		</style>
   `
};
export default config;
