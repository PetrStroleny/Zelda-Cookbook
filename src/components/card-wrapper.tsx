import styled from "@emotion/styled";

const CardWrapper = styled("div")`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(264px, 1fr));

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        gap: 13px;
    }
    
    grid-auto-rows: auto;
`;

export default CardWrapper;