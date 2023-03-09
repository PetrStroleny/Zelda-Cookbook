import styled from "@emotion/styled";
import { FC } from "react";
import { Ingredient } from "../pages/ingredients";

const Food: FC<Ingredient> = ({ name, numberOfHeaths, specialEffect }) => (
    <Wrapper>
        <HearthsWrapper>
            {numberOfHeaths < 999 && 
                new Array(Math.floor(numberOfHeaths)).fill("").map((_, i) => 
                    <img key={i} src="public/icons/heart.svg"/>
                )      
            }
        </HearthsWrapper> 
        <IconWrapper>
            <img src={`public/ingredients/${name.replace(" ", "_")}.png`}/>
        </IconWrapper>
        <Name>
            {name}
        </Name>
        {specialEffect && 
            <SpecialEffect>
                    <img src={`public/icons/${specialEffect.name}.svg`}/>
                    <img src="public/icons/time.svg"/>
                    <p>{specialEffect.duration}</p>
            </SpecialEffect>
        }
    </Wrapper>
    
);
const Wrapper = styled("div")`
    width: 264px;
    border-radius: 20px;
    background-color: #E5E5E5;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: flex-end;
    padding: 22px;
`;

const IconWrapper = styled("div")`
    width: 160px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Name = styled("p")`
    margin-top: 20px;
    color: ${p => p.theme.content.primary};
    ${p => p.theme.fontStyles.b1};
    width: 100%;
`;

const HearthsWrapper = styled("div")`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
    height: 22px;
`;

const SpecialEffect = styled("div")`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: 8px;

    > img:first-of-type {
        margin-right: 8px;
    }

    > p {
        color: ${p => p.theme.content.secondary};
        ${p => p.theme.fontStyles.items};
    }
`;


export default Food;