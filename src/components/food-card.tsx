import styled from "@emotion/styled";
import { FC } from "react";
import { Ingredient } from "../pages/ingredients";

interface FoodCardProps extends Ingredient {
    isIngredient?: boolean
}

const FoodCard: FC<FoodCardProps> = ({ name, extraHearths, numberOfHeaths, specialEffect, isIngredient }) => {

    const numberOfSingleHearths = numberOfHeaths == 5 ? 5 : Math.floor(numberOfHeaths % 5)

    return (
        <Wrapper>
        <HearthsWrapper>
            <div>
                {extraHearths != null && 
                    <>
                        <img style={{marginRight: "6px"}} src="public/icons/extra-heart.svg"/> 
                        <p>
                            + 
                            {" " + extraHearths}
                        </p>
                    </>
                }
            </div>
            <div>
                {numberOfHeaths == 999 ?
                        <>
                            <img src="public/icons/heart.svg"/>
                            <FullRecovery>
                                Full Recovery
                            </FullRecovery> 
                        </>
                    :   
                        <>
                            {numberOfHeaths >= 6 &&
                                <HearthWithIndex>
                                    <img src="public/icons/heart.svg"/>
                                    <p>{numberOfHeaths - numberOfSingleHearths}</p>
                                </HearthWithIndex>
                            }
                                
                                
                            {new Array(numberOfSingleHearths).fill("").map((_, i) => 
                                <img key={i} src="public/icons/heart.svg"/>
                            )}  
                        </>
                }
            </div>
        </HearthsWrapper>

        <IconWrapper>
            <img src={`public/${isIngredient ? "ingredients": "recipes"}/${name.replace(" ", "_")}.png`}/>
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
}
    
const HearthsWrapper = styled("div")`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    height: 22px;

    > div:first-of-type {
        display: flex;
        >p{
            color: ${p => p.theme.content.primary};
            ${p => p.theme.fontStyles.items};
        }
    }

    > div:last-of-type {
        display: flex;
    }
`;

const Wrapper = styled("div")`
    
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

const FullRecovery = styled("p")`
    color: ${p => p.theme.content.primary};
    ${p => p.theme.fontStyles.items};
    margin-left: 3px;
`;

const HearthWithIndex = styled("div")`
    position: relative;

    > p {
        color: ${p => p.theme.inverse.content.primary};
        background-color: #F1362F;
        border-radius: 999px;
        position: absolute;
        bottom: 5px;
        font-size: 12px;
        left: 10px;
        padding: 0px 2px;
    }
`;

export default FoodCard;