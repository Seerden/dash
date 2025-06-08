import { gap, pad } from "@/lib/style/spacing";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const TableWrapper = styled.div<{ columns: number }>`
	margin: 1.5rem;
	display: grid;
	grid-template-columns: repeat(${(p) => p.columns}, max-content);

	// temporary
	outline: 2px solid orange;
	padding: 1rem;
`;

export const subgridColumn = css`
	display: grid;
	grid-template-columns: subgrid;
	grid-column: 1 / -1;
`;

const TableRow = styled.div`
	${subgridColumn};

	padding: 0rem 1rem;
	${gap.large};
`;

const Cell = styled.div``;

const TableHeader = styled(TableRow)`
	font-weight: bold;

	position: sticky;
	top: 0;
	border-top: 0.5rem solid #f2f2f2; // needs to match the backgorund color so that the elements scrolling behind it don't show up.

	background-color: #ddd;

	padding-block: 0.5rem;
	margin-bottom: 0.5rem;
`;

const InnerCell = styled.div`
	${pad.wide(0.3, 2)};
`;

export default {
	TableWrapper,
	TableRow,
	Cell,
	InnerCell,
	TableHeader
};
