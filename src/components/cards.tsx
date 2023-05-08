import styled from "@emotion/styled";
import { FC, useContext, useEffect } from "react";
import { Ingredient } from "../pages/ingredients";
import { Recipe } from "../pages/recipes";
import FoodCard from "./food-card";
import { GlobalContext } from "../utils/global-context";
import LoadingFoodCard from "./loading-food-card";

interface CardsProps {
    items: (Ingredient | Recipe)[]
    loading: boolean
    isIngredient: boolean
}

const Cards: FC<CardsProps> = ({items, loading, isIngredient}) => {
    const {setModalQuery, searchQuery, locationQuery, specialEffectQuery} = useContext(GlobalContext);

    useEffect(() => {
        console.log(loading)
    }, [loading]);

    return (
        (loading || items.length > 0) ?
            <CardWrapper>
                {loading ? 
                    new Array(15).fill("").map(_ => <LoadingFoodCard/>)
                    :
                    items.map((item, index) =>
                        <FoodCard
                            onClick={() => setModalQuery(isIngredient ? `ingredient-${item.id}-0` : `recipe-${item.id}-0`)}
                            key={index}
                            {...item}
                            isIngredient={isIngredient}
                        />
                    )
                }
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