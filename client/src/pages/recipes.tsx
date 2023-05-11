import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddOrEditRecipe from "../components/add-or-edit-modals/add-or-edit-recipe";
import Button, { ButtonVariant } from "../components/button";
import Cards from "../components/cards";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";
import ErrorPage from "./error-page";
import { Ingredient } from "./ingredients";
import { getData } from "../network";
import CardsLoading from "../components/cards-loading";

export interface Recipe extends Ingredient {
    ingredients: number[]
}

const Recipes = () => {
    const [errored, setErrored] = useState(false);
    const [loading, setLoading] = useState(true);

    const {locationQuery, searchQuery, specialEffectQuery, modalQuery, setTransitioning, transitioning} = useContext(GlobalContext);

    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const [addModalActive, setAddModalActive] = useState(false);

    async function fetchRecipes() {
        try {
            if (!recipes) {
                setLoading(true);
            } else {
                setTransitioning(true);
            }            
            const newRecipes = await getData(`recipe?special-effect=${encodeURIComponent(specialEffectQuery)}&search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
            setRecipes(newRecipes);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
            setTransitioning(false);
        }
    }
    
    useEffect(() => {
        fetchRecipes();
    }, [locationQuery, searchQuery, specialEffectQuery, addModalActive, modalQuery]);

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
            {loading ?
                <CardsLoading/>
                :
                <Cards 
                    transition={transitioning}
                    items={recipes} 
                    isIngredient={false} 
                />
            }
        </>
    );
}



export default Recipes;