import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddOrEditIngredient from "../components/add-or-edit-modals/add-or-edit-ingredient";
import Button, { ButtonVariant } from "../components/button";
import Cards from "../components/cards";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";
import ErrorPage from "./error-page";


export interface SpecialEffect {
    name: string
    duration: number
}
export interface Ingredient {
    id: number
    numberOfHearts: number
    extraHearts?: number
    name: string
    description: string
    specialEffect?: SpecialEffect
    price: number
}

const Ingredients = () => {
    const [errored, setErrored] = useState(false);
    const [loading, setLoading] = useState(false);
    const {ingredients, regions, locationQuery, searchQuery, specialEffectQuery} = useContext(GlobalContext);

    const [activeIngredients, setAcitiveIngredients] = useState<Ingredient[]>([]);

    const [addModalActive, setAddModalActive] = useState(false);

    async function fetchIngedients() {
        try {
            setLoading(true);
            let filteredIngrediences = [];

            ingredientLoop: for await (const ingredient of ingredients) {
                if (!ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())) continue ingredientLoop;
                if (specialEffectQuery && ingredient.specialEffect?.name != specialEffectQuery) continue ingredientLoop;
                if (regions) {
                    firstLoop: for (const region of regions) {
                        for (const location of region.locations) {
                            if (location.name == locationQuery) {
                                if (!location.ingredients.includes(ingredient.id)) continue ingredientLoop;
                                break firstLoop;
                            }
                        }
                    }
                }
                filteredIngrediences.push(ingredient);
            }

            setAcitiveIngredients(filteredIngrediences);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchIngedients();
    }, [locationQuery, searchQuery, ingredients, specialEffectQuery]);
    
    if (errored) {
        return <ErrorPage/>;
    }

    if (ingredients.length == 0) {
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

            {addModalActive && <AddOrEditIngredient hide={() => setAddModalActive(false)}/>}

            <PageHeader 
                trailing={
                    <Button 
                        onClick={() => setAddModalActive(true)}
                        variant={ButtonVariant.BLUE} 
                        rounded
                    >
                        <img src="public/icons/add.svg"/>
                    </Button>
                }>
                Ingredience
            </PageHeader>
            <Cards 
                items={activeIngredients} 
                isIngredient={true} 
                loading={loading}
            />
        </>
    );
}


export default Ingredients;