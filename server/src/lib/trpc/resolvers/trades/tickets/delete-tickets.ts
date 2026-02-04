import { z } from "@shared/types/zod.utility.types";
import { publicProcedure } from "@/lib/trpc/procedures/public.procedure";

export const deleteTicketsMutation = publicProcedure
	.input(
		z.object({
			ids: z.string().array(),
		})
	)
	.mutation(async () => {
		return;
	});
