import { Helmet } from "react-helmet";
import FoodCard from "../components/food-card";
import CardWrapper from "../components/card-wrapper";
import { Ingredient } from "./ingredients";
import { useEffect, useState } from "react";
import ErrorPage from "./error-page";
import PageHeader from "../components/page-header";

export interface Recipe extends Ingredient {
    ingredients: number[]
}

const Recipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>();
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);

    async function fetchRecipes() {
        try {
            setLoading(true);
            const res = await fetch('../server/recipes.json');
            const json = await res.json();
            
            setRecipes(json.data);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
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
                {recipes.map((recipe, index) => (
                    <FoodCard
                        key={index}
                        {...recipe}
                    />
                ))}
            </CardWrapper>
        </>
    );
}



export default Recipes;