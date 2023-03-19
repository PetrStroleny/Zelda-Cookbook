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
    const [loading, setLoading] = useState(false);

    async function fetchLocations() {
        try {
            const res = await fetch('../server/locations.json');
            const json = await res.json();
            
            setLocations(json.data)
        } catch (e) {
            console.error(e);
            setErrored(true);
        }
    }

    async function fetchRecipes() {
        try {
            setLoading(true);
            const res = await fetch('../server/recipes.json');
            const json: {data: Recipe[]} = await res.json();
            setRecipes(json.data);
            let filteredIngrediences = [];

            recipeLoop: for (const recipe of json.data) {
                if (!recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) continue recipeLoop;
                if (locations) {
                    firstLoop: for (const location of locations) {
                        for (const subLocation of location.subLocations) {
                            if (subLocation.name == locationQuery) {
                                for (let i = 0; i < recipe.ingredients.length; i++) {
                                    for (let x = 0; x < recipe.ingredients[i].length; x++) {
                                        if (subLocation.ingredients.includes(recipe.ingredients[i][x])) {
                                            continue recipeLoop;;
                                        }
                                    }
                                }
                                break firstLoop;
                            }
                        }
                    }
                }

                filteredIngrediences.push(recipe);
            }
            
            setRecipes(filteredIngrediences);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [locationQuery, searchQuery, locations]);

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
                {!loading ? recipes.map((recipe, index) => {
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
                }) : <div>Nacitani...</div>}
            </CardWrapper>
        </>
    );
}



export default Recipes;