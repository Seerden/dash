import type { AppRouter } from "@server/lib/trpc";
import { createTRPCReact } from "@trpc/react-query";

/**
 * Have a bug with type inference, even though our tsconfig is otherwise set up
 * perfectly fine. Using the type annotation as below, makes the error go away.
 * @see https://github.com/pnpm/pnpm/issues/6089
 * @see https://github.com/microsoft/TypeScript/issues/42873#issuecomment-1416128545
 */
export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
	createTRPCReact<AppRouter>();
