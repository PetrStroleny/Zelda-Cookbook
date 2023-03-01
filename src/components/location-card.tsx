import styled from "@emotion/styled";
import { FC } from "react";
import { Ingredient } from "../pages/ingredients";
import {Location} from "../pages/locations";


const LocationCard: FC<Location> = ({ name }) => (
    <Wrapper>
        <p>
            {name}
        </p>
        <p>
            zástupný obrázek
            <img src="public/locations/akkala.jpeg"/>
        </p>
    </Wrapper>
);

const Wrapper = styled("div")`
    border: 1px solid green;
    width: 200px;
    height: 200px;

    img {
        height: 100px;
        width: 100px;
    }
`;


export default LocationCard;