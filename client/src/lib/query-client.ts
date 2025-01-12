import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			enabled: true,
			gcTime: 1000 * 60 * 5,
			refetchOnMount: true,
			refetchOnWindowFocus: "always"
		}
	}
});

export const defaultQueryConfig = {
	enabled: true,
	retry: false
} as const;
