import styled from "@emotion/styled";
import { FC } from "react";
import { SubLocation } from "../pages/locations";


const LocationCard: FC<SubLocation> = ({ name }) => (
    <Wrapper>
        <Name>
            {name}
        </Name>
        <p>
            <img src={`public/locations/${name.replace(" ", "_")}.png`}/>
        </p>
    </Wrapper>
);

const Wrapper = styled("div")`
    width: 316px;
    height: 308px;
    border-radius: 20px;
    background-color: #E5E5E5;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    padding: 10px;
    
    img {
        width: 316px;
        height: 260px;
        object-fit: fill;
        border-radius: 20px 20px 0px 0px;
    
    } 
`;
const Name = styled("p")`
    color: ${p => p.theme.content.primary};
    ${p => p.theme.fontStyles.b1}

`;


export default LocationCard;