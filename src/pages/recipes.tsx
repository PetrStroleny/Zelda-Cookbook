import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddModal from "../components/add-modal";
import Button, { ButtonVariant } from "../components/button";
import CardWrapper from "../components/card-wrapper";
import FoodCard from "../components/food-card";
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

    const {recipes, setRecipes, locations, locationQuery, searchQuery} = useContext(GlobalContext);

    const [activeRecipes, setActiveRecipes] = useState<Recipe[]>([]);

    const [addModalActive, setAddModalActive] = useState(false);

    async function fetchRecipes() {
        try {
            setLoading(true);
            let filteredIngrediences = [];

            recipeLoop: for (const recipe of recipes) {
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
    }, [locationQuery, searchQuery, recipes]);

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

            {addModalActive &&
                <AddModal 
                    submit={(data) => {}}
                    hide={() => setAddModalActive(false)}
                >
                    <h2>Přidat Recept</h2>
                </AddModal>
            }

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
            
            <CardWrapper>
                {!loading ? activeRecipes.map((recipe, index) => 
                    <FoodCard
                        key={index}
                        {...recipe}
                    />
                ) : <div>Nacitani...</div>}
            </CardWrapper>
        </>
    );
}



export default Recipes;