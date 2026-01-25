import type { UserWithoutPassword } from "@shared/types/user.types";
import type { Context } from "@/lib/trpc/trpc-context";

export async function logUserIn(ctx: Context, user: UserWithoutPassword) {
	ctx.req.session.regenerate((err) => {
		if (err) {
			throw err;
		}

		ctx.req.session.user = user;
		ctx.req.session.save();
	});
}
