import type { Preview } from "@storybook/react";

import "../src/index.scss";
import "../src/normalize.css";

// TODO: include msw: https://github.com/storybookjs/storybook/issues/12489#issuecomment-702958192

const decorators = [
	
];

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	},
	decorators
};
export default preview;
