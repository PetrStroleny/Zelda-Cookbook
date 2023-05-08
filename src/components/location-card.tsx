import styled from "@emotion/styled";
import { FC } from "react";
import { ZeldaLocation } from "../pages/locations";

interface LocationCardProps extends ZeldaLocation {
    onClick: () => void
}

const LocationCard: FC<LocationCardProps> = ({ name, onClick }) => (
    <Wrapper onClick={onClick}>
        <StyledImg src={`public/locations/${name.replaceAll(" ", "_")}.png`}/>
        <Name>
            {name}
        </Name>
    </Wrapper>
);

const Wrapper = styled("div")`
    border-radius: 20px;
    background-color: #E5E5E5;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 2px 3px rgba(0, 0, 0, 0.1);

    &:hover {
        opacity: 0.8;
    }

    &:active {
        opacity: 0.6;
    }
`;

const Name = styled("p")`
    color: ${p => p.theme.content.primary};
    ${p => p.theme.fontStyles.b1}
    padding: 20px;
`;

const StyledImg = styled("img")`
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 20px 20px 0px 0px;  
`;


export default LocationCard;