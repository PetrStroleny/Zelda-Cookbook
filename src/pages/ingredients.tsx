import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CardWrapper from "../components/card-wrapper";
import FoodCard from "../components/food-card";
import FoodFilters, { getLocationValue } from "../components/food-filters";
import PageHeader from "../components/page-header";
import ErrorPage from "./error-page";
import { IngredienceLocation, SubLocation } from "./locations";

export function getSearchValue(): string {
    for (const query of window?.location?.search.substring(1).split("&")) {
        if (query.split("=")[0] == "q") {
            return query.split("=")[1];
        }
    }
    
    return "";
}

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
    const [locations, setLocations] = useState<IngredienceLocation[]>();
    const [errored, setErrored] = useState(false);
    const [searchQuery, setSearchQuery] = useState(getSearchValue());
    const [locationQuery, setLocationQuery] = useState(getLocationValue());

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
        window.history.replaceState({}, "", `${window.location.pathname}${(locationQuery || searchQuery) ? "?" : ""}${searchQuery ? `q=${encodeURI(searchQuery)}` : ""}${locationQuery ? `location=${encodeURI(locationQuery)}` : ""}`)
    }, [searchQuery, locationQuery]);

    useEffect(() => {
        fetchIngedients();
        setSearchQuery(getSearchValue());
        setLocationQuery(getLocationValue());
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
                    if (!ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()))  return;
                    if (locations) {
                        for (const location of locations) {
                            for (const subLocation of location.subLocations) {
                                if (subLocation.name == locationQuery) {
                                    if (!subLocation.ingredients.includes(ingredient.id)) return;
                                    break;
                                }
                            }
                        }
                    }
                    
                    return(
                    <FoodCard
                        key={index}
                        {...ingredient}
                    />
                )})}
            </CardWrapper>
            <FoodFilters search={searchQuery} setSearch={setSearchQuery} location={locationQuery} setLocation={setLocationQuery}/>
        </>
    );
}


export default Ingredients;