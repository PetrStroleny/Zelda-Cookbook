import styled from "@emotion/styled";

const Button = styled("button")`
    padding: 16px;
    border-radius: 20px;
    border: none;
    background: ${p => p.theme.background.tertiary};
    ${p => p.theme.fontStyles.b1}; 
    cursor: pointer;

    &:hover {
        background-color: #DBDBDB;
    }

    &:active {
        background-color: #CCCCCC;
    }

    &.active {

        color: ${p => p.theme.inverse.content.primary};
        background-color: ${p => p.theme.primitives.blue};

        &:hover {
            background-color: #11A6D3;
        }
        
        &:active {
            background-color: #159CC4;
        }
    }
`;



export default Button;