import { Button, render } from "@react-email/components";

export default function Email() {
	return <Button href="https://www.google.com"> 3</Button>;
}

export const html = await render(<Email />);
