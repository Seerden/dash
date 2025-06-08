import { css } from "@emotion/react";

type SpacingRule = "padding" | "margin" | "gap";

/** Restrict the naming of spacing values to this union. Means we'll have access
 *to e.g. "gap.small", "padding.larger", etc. */
type SpacingKey = "smaller" | "small" | "large" | "larger";

/** The allowed spacing values (in rem). */
type SpacingSize = 0.2 | 0.3 | 0.5 | 1 | 2 | 3;

/** The allowed ratios between width and height of wide/tall
 * spacings. */
type SpacingRatio = 1 | 2 | 3 | 5 | 8;

const spacing = {
	smaller: "0.3rem" as const,
	small: "0.5rem" as const,
	large: "1rem" as const,
	larger: "2rem" as const
} satisfies Record<SpacingKey, `${SpacingSize}rem`>;

function wide(rule: SpacingRule) {
	return (size: SpacingSize, ratio: SpacingRatio) => css`
		${rule}-inline: ${+size * ratio}rem;
		${rule}-block: ${size}rem;
	`;
}

const spacingObject = (rule: SpacingRule) =>
	({
		smaller: {
			[rule]: spacing.smaller
		} as const,
		small: {
			[rule]: spacing.small
		} as const,
		large: {
			[rule]: spacing.large
		} as const,
		wide: wide(rule)
	}) as const;

export const gap = spacingObject("gap");
export const mar = spacingObject("margin");
export const pad = spacingObject("padding");
