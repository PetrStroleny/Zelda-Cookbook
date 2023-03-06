import styled from "@emotion/styled";
import { FC } from "react";
import { Ingredient } from "../pages/ingredients";


const Food: FC<Ingredient> = ({ name, numberOfHeaths, value, specialEffect }) => (
    
    <Wrapper>
        <p>
            {name}
        </p>
        <p>
             {numberOfHeaths}
        </p>
        <p>
             {value}
        </p>
        <p>
            
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
    width: 264px;
    height: 324px;
    border-radius: 20px;
    background-color: #E5E5E5;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    align-content: flex-end;

    > p  { 
        font-size: 100px;

}

`;



export default Food;