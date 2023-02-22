import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Card from "../components/card";
import CardWrapper from "../components/card-wrapper";
import ErrorPage from "./error-page";

export interface Ingredient {
    id: number
    name: string
}

const Ingredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);

    async function fetchIngedients() {
        try {
            setLoading(true);
            const res = await fetch('../server/ingredients.json');
            const json = await res.json();
            
            setIngredients(json.data);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
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
            </>
        );
    }

    return(
        <>
            <Helmet>
                <meta property="og:title" content="Ingredience | ZELDA COOK"/>
                <title>Ingredience | ZELDA COOK</title>
            </Helmet>
            <CardWrapper>
                {ingredients.map((ingredient, index) => (
                    <Card
                        key={index}
                        name={ingredient.name}
                    />
                ))}
            </CardWrapper>
        </>
    );
}


export default Ingredients;