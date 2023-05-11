import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Theme } from "../style-variables";

export enum ButtonVariant {
    BLUE,
    PRIMARY,
    RED,
}

function getButtonColor(variant: ButtonVariant) {
    switch(variant) {
        case ButtonVariant.RED:
            return css`
                background-color: ${Theme.primitives.red};
                color: ${Theme.inverse.content.primary};

                &:hover {
                    opacity: 0.8;
                }

                &:active {
                    opacity: 0.6;
                }
            `;
        case ButtonVariant.BLUE:
            return css`
                background-color: ${Theme.primitives.blue};
                color: ${Theme.inverse.content.primary};

                &:hover {
                    opacity: 0.8;
                }

                &:active {
                    opacity: 0.6;
                }
            `;
        case ButtonVariant.PRIMARY:
            return css`
                background-color: ${Theme.background.tertiary};

                &:hover {
                    opacity: 0.8;
                }

                &:active {
                    opacity: 0.6;
                }
            `;
    }
}

const Button = styled("button")<{rounded?: boolean, variant?: ButtonVariant}>`
    border-radius: ${p => p.rounded ? 9999 : 20}px;
    padding: ${p => p.rounded ? 6 : 16}px;
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
        padding: ${p => p.rounded ? 4 : 14}px;
    }

    &.active {
        color: ${p => p.theme.inverse.content.primary};
        background-color: ${p => p.theme.primitives.blue};

        &:hover {
            opacity: 0.8;
        }

        &:active {
            opacity: 0.6;
        }
    }
`;

export default Button;