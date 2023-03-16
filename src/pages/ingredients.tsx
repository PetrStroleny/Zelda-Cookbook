import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CardWrapper from "../components/card-wrapper";
import FoodCard from "../components/food-card";
import PageHeader from "../components/page-header";
import ErrorPage from "./error-page";
import { IngredienceLocation, SubLocation } from "./locations";


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

interface IngredientsProps {
    locationQuery: string
    searchQuery: string
}

const Ingredients: FC<IngredientsProps> = ({locationQuery, searchQuery}) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [locations, setLocations] = useState<IngredienceLocation[]>();
    const [errored, setErrored] = useState(false);

    async function fetchIngedients() {
        try {
            const res = await fetch('../server/ingredients.json');
            const json = await res.json();
            setIngredients(json.data);

            const res2 = await fetch('../server/locations.json');
            const json2 = await res2.json();
            setLocations(json2.data)
        } catch (e) {
            console.error(e);
            setErrored(true);
        }
    }

    useEffect(() => {
        fetchIngedients();
    }, []);

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
                {ingredients.map((ingredient, index) => {
                    if (!ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())) return;
                    if (locations) {
                        firstLoop: for (const location of locations) {
                            for (const subLocation of location.subLocations) {
                                if (subLocation.name == locationQuery) {
                                    if (!subLocation.ingredients.includes(ingredient.id)) return;
                                    break firstLoop;
                                }
                            }
                        }
                    }

                    return(
                        <FoodCard
                            key={index}
                            {...ingredient}
                            isIngredient
                        />
                    )})}
            </CardWrapper>
        </>
    );
}


export default Ingredients;