import styled from "@emotion/styled";

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	width: max-content;

	margin: 2rem;
`;

const Label = styled.label`
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
`;

export default {
	Form,
	Label
};
