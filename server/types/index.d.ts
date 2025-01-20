import type { UserWithoutPassword } from "@shared/types/user.types";
import "express-session";

declare module "express-session" {
	export interface SessionData {
		// TODO: once User model is implemented, use Pick<User, ...>.
		user?: UserWithoutPassword;
	}
}
