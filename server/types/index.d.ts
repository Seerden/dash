declare module "express-session" {
	export interface SessionData {
		// TODO: once User model is implemented, use Pick<User, ...>.
		user?: {
			user_id: ID;
			username: string;
		};
	}
}

declare namespace Express {
	interface Request {
		// TODO: same note as above
		user?: {
			user_id: ID;
			username: string;
		};
	}
}
