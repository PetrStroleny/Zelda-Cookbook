import { css, Global, keyframes, ThemeProvider } from '@emotion/react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./app";
import { Theme } from './style-variables';

export const FadingAnimation = keyframes`
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.15;
  }

  to {
    opacity: 1;
  }
`;

const GlobalStyles = css`

* {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    a {
        text-decoration: none;
        color: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
    }

    ::-webkit-scrollbar {
        width: 14px;
        position: absolute;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 999px;
        box-shadow: inset 0 0 14px 14px ${Theme.scrollBar};
        border: solid 4px transparent;
        border-right-width: 5px;
        border-left-width: 5px;
        
        @supports not (overflow-y: overlay) {
            border-color: ${Theme.background.secondary};
        }
        @supports not (overflow-x: overlay) {
            border-color: ${Theme.background.secondary};
        }
    }
  
    html, body, div#root {
        height: 100%;
    }

    body {
        font-size: 14px;
        background-color: ${Theme.background.secondary};

        &.scroll-disabled {
            overflow-y: hidden;
        }
    }

    .hide-on-desktop {
        @media screen and (min-width: ${Theme.breakPoints.mobile}px) {
            display: none !important;
     
            >*{
                display: none !important;
            }
        }
    }
    
    .hide-on-mobile {
        @media screen and (max-width: ${Theme.breakPoints.mobile}px) {
            display: none !important;
   
            >*{
                display: none !important;
            }
        }
    }

    .fading {
      animation-delay: 2ms;
      animation: ${FadingAnimation} 1.5s linear infinite;
    }
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ThemeProvider theme={Theme}>
      <Global styles={GlobalStyles} />
      <App />
    </ThemeProvider>,
)
