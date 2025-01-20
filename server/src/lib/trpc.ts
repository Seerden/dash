import { sqlConnection } from "@/db/init";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";
import { login } from "@/lib/trpc/resolvers/login.resolver";
import { logout } from "@/lib/trpc/resolvers/logout.resolver";
import { me } from "@/lib/trpc/resolvers/me.resolver";
import { register } from "@/lib/trpc/resolvers/register.resolver";
import { verifyMe } from "@/lib/trpc/resolvers/verify-me.resolver";
import { t } from "@/lib/trpc/trpc-context";
import { z } from "zod";

export const appRouter = t.router({
	hello: publicProcedure
		.input(z.object({ name: z.string() }))
		.query(({ input, ctx }) => {
			return { message: `Hello, ${input.name}!` };
		}),
	bye: publicProcedure.input(z.object({ name: z.string() })).query(({ input, ctx }) => {
		return { message: `Hello, ${input.name}!` };
	}),
	dbTest: publicProcedure.query(async () => {
		{
			// const result = await pingDatabase();
			return {
				sql: sqlConnection,
				db: await sqlConnection`select array[1]`,
				env: process.env,
				who: "am i",
			};
		}
	}),
	auth: {
		me,
		logout,
		login,
		register,
		verifyMe,
	},
});

export type AppRouter = typeof appRouter;
