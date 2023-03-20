import styled from "@emotion/styled";
import { FC } from "react";
import { SubLocation } from "../pages/locations";


const LocationCard: FC<SubLocation> = ({ name }) => (
    <Wrapper>
        
        <StyledImg src={`public/locations/${name.replace(" ", "_")}.png`}/>
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