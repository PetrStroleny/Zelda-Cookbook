import styled from "@emotion/styled";

const Button = styled("button")`

    &:hover {
        background-color: #808080;
    }

    &:active {
        background-color: #00BFFA;
    }

    &.active {
        background-color: #00BFFA;

        &:hover {
            background-color: #6F8FAF;
        }

        &:active {
            background-color: #00BFFA;
        }
    }
`;



export default Button;