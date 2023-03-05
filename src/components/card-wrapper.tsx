import styled from "@emotion/styled";

const CardWrapper = styled("div")`
    width: 100%;
    display: grid;
    gap: 20px;
    border: 1px solid red;

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        gap: 13px;
    }

    grid-template-columns: repeat(auto-fill, minmax(336px, 1fr));

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        grid-template-columns: repeat(auto-fill, minmax(169px, 1fr));
    }

    grid-auto-rows: auto;
`;

export default CardWrapper;