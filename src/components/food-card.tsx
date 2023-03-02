import styled from "@emotion/styled";
import { FC } from "react";
import { Ingredient } from "../pages/ingredients";


const Food: FC<Ingredient> = ({ name, description, numberOfHeaths, value, specialEffect }) => (
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
            cena: {value}
        </p>
        <p>
            zástupný obrázek
            <img src="public/ingredients/apple.png"/>
            {specialEffect && 
                <>
                    <img src={`public/icons/${specialEffect.name}.svg`}/>
                    <p>{specialEffect.duration}</p>
                </>
            }
        </p>
    </Wrapper>
);

const Wrapper = styled("div")`
    border: 1px solid green;
    width: 200px;
    height: 200px;
`;


export default Food;