import type { MainTheme } from "@/lib/style/theme";
import "@emotion/react";

declare module "@emotion/react" {
	export type Theme = MainTheme;
}
