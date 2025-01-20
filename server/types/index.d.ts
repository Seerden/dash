import "express-session";

declare module "express-session" {
	export interface SessionData {
		// TODO: once User model is implemented, use Pick<User, ...>.
		user?: {
			user_id: ID;
			username: string;
		};
	}
}
