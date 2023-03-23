import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Theme } from "../style-variables";

export enum ButtonVariant {
    GREEN,
    BLUE,
    PRIMARY,
}

function getButtonColor(variant: ButtonVariant) {
    switch(variant) {
        case ButtonVariant.GREEN:
            return css`
                background-color: ${Theme.primitives.green};

                &:hover {
                    background-color: #9DF19D;
                }

                &:active {
                    background-color: #94D894;
                }
            `;
        case ButtonVariant.BLUE:
            return css`
                background-color: ${Theme.primitives.blue};
                color: ${Theme.inverse.content.primary};

                &:hover {
                    background-color: #32B1D8;
                }

                &:active {
                    background-color: #359AB9;
                }
            `;
        case ButtonVariant.PRIMARY:
            return css`
                background-color: ${Theme.background.tertiary};

                &:hover {
                    background-color: #DBDBDB;
                }

                &:active {
                    background-color: #CCCCCC;
                }
            `;
    }
}

const Button = styled("button")<{rounded?: boolean, variant?: ButtonVariant}>`
    border-radius: ${p => p.rounded ? 9999 : 20}px;
    padding: ${p => p.rounded ? 2 : 16}px;
    height: fit-content;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    ${p => p.theme.fontStyles.b1}; 
    cursor: pointer;
    white-space: nowrap;

    ${p => getButtonColor(p.variant ?? ButtonVariant.PRIMARY)};

    &:focus {
        outline: none;
        border: 2px solid ${p => p.variant == ButtonVariant.BLUE ? p.theme.background.tertiary : p.theme.primitives.blue};
        padding: ${p => p.rounded ? 0 : 14}px;
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