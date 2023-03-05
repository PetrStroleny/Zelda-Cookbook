import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import FoodCard from "../components/food-card";
import CardWrapper from "../components/card-wrapper";
import ErrorPage from "./error-page";
import PageHeader from "../components/page-header";

export interface SpecialEffect {
    name: string
    duration: number
}
export interface Ingredient {
    id: number
    numberOfHeaths: number
    extraHearths?: number
    name: string
    description: string
    specialEffect?: SpecialEffect
    value: number
}

const Ingredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);

    async function fetchIngedients() {
        try {
            const res = await fetch('../server/ingredients.json');
            const json = await res.json();
            
            setIngredients(json.data);
        } catch (e) {
            console.error(e);
            setErrored(true);
        }
    }

    useEffect(() => {fetchIngedients()}, []);

    if (errored) {
        return <ErrorPage/>;
    }

    if (!ingredients) {
        return (
            <>
                <Helmet>
                    <title>Načítání... | ZELDA COOK</title>
                </Helmet>
                <PageHeader>
                    Ingredience
                </PageHeader>
            </>
        );
    }

    return(
        <>
            <Helmet>
                <meta property="og:title" content="Ingredience | ZELDA COOK"/>
                <title>Ingredience | ZELDA COOK</title>
            </Helmet>
            <PageHeader>
                Ingredience
            </PageHeader>
            <CardWrapper>
                {ingredients.map((ingredient, index) => (
                    <FoodCard
                        key={index}
                        {...ingredient}
                    />
                ))}
            </CardWrapper>
        </>
    );
}


export default Ingredients;