import { createTheme, DEFAULT_THEME, MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import { queryClient } from "../src/lib/query-client";
import { theme } from "../src/lib/theme/theme";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../src/index.scss";
import "../src/normalize.css";

// TODO: include msw: https://github.com/storybookjs/storybook/issues/12489#issuecomment-702958192

const decorators = [
	(Story) => (
		<ThemeProvider theme={theme}>
			<Story />
		</ThemeProvider>
	),
	(Story) => (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} position="bottom" />
			<Story />
		</QueryClientProvider>
	),
	(Story) => (
		<MantineProvider theme={createTheme(DEFAULT_THEME)}>
			<Story />
		</MantineProvider>
	),
	(Story) => (
		<RecoilRoot>
			<Story />
		</RecoilRoot>
	),
	// TODO: components that use react-router hooks need to be wrapped in a
	// Router, but I don't know if just wrapping things in a Router is functional
	// enough, because of how we render pages in the app (i.e. inside AnimatedRoutes)
	(Story) => (
		<MemoryRouter>
			<Story />
		</MemoryRouter>
	)
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
