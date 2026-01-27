import { t } from "@/lib/trpc/trpc-context";

export const publicProcedure = t.procedure.use(async (opts) => {
	try {
		return opts.next(opts);
	} catch (_error) {
		// do something here? or use router's onError?
		return opts.next(opts);
	}
});
