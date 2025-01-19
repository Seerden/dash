import { t } from "@/lib/trpc";

export const publicProcedure = t.procedure.use(async (opts) => {
	try {
		return opts.next(opts);
	} catch (error) {
		// do something here? or use router's onError?
		return opts.next(opts);
	}
});
