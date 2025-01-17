// TODO: this whole thing is here for testing purposes.

import { Button } from "@react-email/components";
import { renderToStaticMarkup } from "react-dom/server";

type EmailProps = {
   href: string;
}

function Email ({href}: EmailProps) {
   return (
      <Button href={href}>Testing</Button>
   )
}

export function testThing(href: string) {
   return href;
}

export function generateEmailHtml(href: string) {
   return renderToStaticMarkup(<Email href={href} />);
}
