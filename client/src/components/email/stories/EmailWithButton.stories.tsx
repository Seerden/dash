import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Email from "../EmailWithButton";

const meta: Meta<typeof Email> = {
	title: "Components/email/EmailWithButton",
	component: Email
};

export default meta;
type Story = StoryObj<typeof Email>;

export const Default: Story = {};

export const RenderedHTML: Story = {
	render: () => {
		const [html, setHtml] = useState<string>("");

		useEffect(() => {
			(async () => {
				const result = renderToStaticMarkup(<Email />); // `render` from @react-email/render doesn't work
				setHtml(result);
			})();
		}, []);

		return (
			<pre
				style={{
					backgroundColor: "#f4f4f4",
					padding: "16px",
					borderRadius: "8px",
					overflowX: "auto"
				}}
			>
				{html || "Loading..."}
			</pre>
		);
	}
};
