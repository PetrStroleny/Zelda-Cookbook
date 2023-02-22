import styled from "@emotion/styled";
import { FC } from "react";

interface CardProps {
    name: string
}

const Card: FC<CardProps> = ({ name }) => (
    <Wrapper>
        <p>
            {name}
        </p>
    </Wrapper>
);

const Wrapper = styled("div")`
    cursor: pointer;
    border-radius: 40px;
    background-color: ${p => p.theme.tints.gray};
    padding: 40px;

    &:hover {
        opacity: 0.6;
    }

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        margin-bottom: 15px;
    }
`;



export default Card;