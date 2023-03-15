import { Helmet } from "react-helmet";
import FoodCard from "../components/food-card";
import CardWrapper from "../components/card-wrapper";
import { Ingredient } from "./ingredients";
import { FC, useEffect, useState } from "react";
import ErrorPage from "./error-page";
import PageHeader from "../components/page-header";
import FoodFilters from "../components/food-filters";
import { IngredienceLocation } from "./locations";

export interface Recipe extends Ingredient {
    ingredients: number[][]
}

interface RecipesProps {
    locationQuery: string
    searchQuery: string
}

const Recipes: FC<RecipesProps> = ({locationQuery, searchQuery}) => {
    const [recipes, setRecipes] = useState<Recipe[]>();
    const [locations, setLocations] = useState<IngredienceLocation[]>();
    const [errored, setErrored] = useState(false);

    async function fetchRecipes() {
        try {
            const res = await fetch('../server/recipes.json');
            const json = await res.json();
            setRecipes(json.data);

            const res2 = await fetch('../server/locations.json');
            const json2 = await res2.json();
            setLocations(json2.data)
        } catch (e) {
            console.error(e);
            setErrored(true);
        }
    }

    useEffect(() => {fetchRecipes()}, []);

    if (errored) {
        return <ErrorPage/>;
    }

    if (!recipes) {
        return (
            <>
                <Helmet>
                    <title>Načítání... | ZELDA COOK</title>
                </Helmet>
                <PageHeader>
                    Recepty
                </PageHeader>
            </>
        );
    }

    return(
        <>
            <Helmet>
                <meta property="og:title" content="Recepty | ZELDA COOK"/>
                <title>Recepty | ZELDA COOK</title>
            </Helmet>
                <PageHeader>
                    Recepty
                </PageHeader>
            <CardWrapper>
                {recipes.map((recipe, index) => {
                    if (!recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))  return;
                    if (locations) {
                        firstLoop: for (const location of locations) {
                            for (const subLocation of location.subLocations) {
                                if (subLocation.name == locationQuery) {
                                    let recipeIngredientInLocation = false;
                                    for (let i = 0; i < recipe.ingredients.length; i++) {
                                        for (let x = 0; x < recipe.ingredients[i].length; x++) {
                                            if (subLocation.ingredients.includes(recipe.ingredients[i][x])) {
                                                return;
                                            }
                                        }
                                    }
                                    break firstLoop;
                                }
                            }
                        }
                    }

                    return(
                        <FoodCard
                            key={index}
                            {...recipe}
                        />
                    )
                })}
            </CardWrapper>
        </>
    );
}



export default Recipes;