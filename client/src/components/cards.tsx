import styled from "@emotion/styled";
import { FC, useContext } from "react";
import { Ingredient } from "../pages/ingredients";
import { Recipe } from "../pages/recipes";
import { GlobalContext } from "../utils/global-context";
import FoodCard from "./food-card";

interface CardsProps {
    items: (Ingredient | Recipe)[]
    transition: boolean
    isIngredient: boolean
}

const Cards: FC<CardsProps> = ({items, transition, isIngredient}) => {
    const {setModalQuery, searchQuery, locationQuery, specialEffectQuery} = useContext(GlobalContext);

    return (
        (items.length > 0) ?
            <CardWrapper className={transition ? "fading" : ""}>
                {items.map((item, index) =>
                    <FoodCard
                        onClick={() => setModalQuery(isIngredient ? `ingredient-${item.id}-0` : `recipe-${item.id}-0`)}
                        key={index}
                        {...item}
                        isIngredient={isIngredient}
                    />
                )}
            </CardWrapper>
            :
            <NotFoundText>
                {(searchQuery.length > 0 || locationQuery.length > 0 || specialEffectQuery.length > 0) ? 
                    `Pro zadané filtry nebyly nalezeny žádné ${isIngredient ? "ingredience" : "recepty"}.` 
                        : 
                    `Žádné ${isIngredient ? "ingredience" : "recepty"}.`
                }
            </NotFoundText>
    );
}

export const CardWrapper = styled("div")`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(264px, 1fr));
    
    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        gap: 13px;
    }
    
    grid-auto-rows: auto;
`;

export const NotFoundText = styled("p")`
    min-width: 100%;
    text-align: center;
    ${p => p.theme.fontStyles.h3};
`;

export default Cards;