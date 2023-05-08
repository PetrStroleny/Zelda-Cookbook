import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddOrEditRecipe from "../components/add-or-edit-modals/add-or-edit-recipe";
import Button, { ButtonVariant } from "../components/button";
import Cards from "../components/cards";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";
import ErrorPage from "./error-page";
import { Ingredient } from "./ingredients";

export interface Recipe extends Ingredient {
    ingredients: number[][]
}

const Recipes = () => {
    const [errored, setErrored] = useState(false);
    const [loading, setLoading] = useState(false);

    const {recipes, locations, locationQuery, searchQuery, setModalQuery, specialEffectQuery} = useContext(GlobalContext);

    const [activeRecipes, setActiveRecipes] = useState<Recipe[]>([]);

    const [addModalActive, setAddModalActive] = useState(false);

    async function fetchRecipes() {
        try {
            setLoading(true);
            let filteredIngrediences = [];

            recipeLoop: for await (const recipe of recipes) {
                if (!recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) continue recipeLoop;
                if (specialEffectQuery && recipe.specialEffect?.name != specialEffectQuery) continue recipeLoop;
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
            
            setActiveRecipes(filteredIngrediences);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchRecipes();
    }, [locationQuery, searchQuery, recipes, specialEffectQuery]);

    if (errored) {
        return <ErrorPage/>;
    }

    if (recipes.length == 0) {
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

            {addModalActive && <AddOrEditRecipe hide={() => setAddModalActive(false)}/>}

            <PageHeader
                trailing={
                    <Button 
                        onClick={() => setAddModalActive(true)}
                        variant={ButtonVariant.BLUE} 
                        rounded
                    >
                        <img src="public/icons/add.svg"/>
                    </Button>}
            >
                Recepty
            </PageHeader>
            <Cards 
                items={activeRecipes} 
                isIngredient={false} 
                loading={loading}
                
            />
        </>
    );
}



export default Recipes;