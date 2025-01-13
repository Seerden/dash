declare module "express-session" {
	export interface SessionData {
		user?: {
			user_id: ID;
			username: string;
		};
	}
}

declare namespace Express {
	interface Request {
		user?: {
			user_id: ID;
			username: string;
		};
	}
}
