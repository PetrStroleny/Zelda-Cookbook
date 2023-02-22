import styled from "@emotion/styled";

const CardWrapper = styled("div")`
    width: 100%;
    display: grid;
    padding: 40px;
    gap: 20px;

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        padding: 14px 12px;
        gap: 13px;
    }

    
    grid-template-columns: repeat(auto-fill, minmax(336px, 1fr));

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        grid-template-columns: repeat(auto-fill, minmax(169px, 1fr));
    }

    grid-auto-rows: auto;
`;

export default CardWrapper;