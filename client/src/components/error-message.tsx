import styled from "@emotion/styled";

const ErrorMessage = styled("p")`
    width: calc(100% - 17px);
    color: ${p => p.theme.primitives.red};
    margin-top: 7px;
    margin-left: 17px;
    ${p => p.theme.fontStyles.items};
`;

export default ErrorMessage;