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

    async function fetchIngedients() {
        try {
            setLoading(true);
            const res = await fetch('../server/ingredients.json');
            const json: {data: Ingredient[]} = await res.json();
            let filteredIngrediences = [];

            ingredientLoop: for (const ingredient of json.data) {
                if (!ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())) continue ingredientLoop;
                if (locations) {
                    firstLoop: for (const location of locations) {
                        for (const subLocation of location.subLocations) {
                            if (subLocation.name == locationQuery) {
                                if (!subLocation.ingredients.includes(ingredient.id)) continue ingredientLoop;
                                break firstLoop;
                            }
                        }
                    }
                }
                filteredIngrediences.push(ingredient);
            }

            setIngredients(filteredIngrediences);
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
        fetchIngedients();
    }, [locationQuery, searchQuery, locations]);

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
                {!loading ? ingredients.map((ingredient, index) => (
                        <FoodCard
                            key={index}
                            {...ingredient}
                            isIngredient
                        />
                    )) :
                    <div>Nacitani....</div>
                }
            </CardWrapper>
        </>
    );
}


export default Ingredients;