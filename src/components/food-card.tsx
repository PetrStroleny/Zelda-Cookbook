import styled from "@emotion/styled";
import { FC } from "react";
import { Ingredient } from "../pages/ingredients";


const Food: FC<Ingredient> = ({ name, description, numberOfHeaths }) => (
    <Wrapper>
        <p>
            {name}
        </p>
        <p>
            {description}
        </p>
        <p>
            počet srdíček: {numberOfHeaths}
        </p>
        <p>
            zástupný obrázek
            <img src="public/ingredients/apple.png"/>
            <img src="public/icons/tough.svg"/>
        </p>
    </Wrapper>
);

const Wrapper = styled("div")`
    border: 1px solid green;
    width: 200px;
    height: 200px;
`;


export default Food;