import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddOrEditIngredient from "../components/add-or-edit-modals/add-or-edit-ingredient";
import Button, { ButtonVariant } from "../components/button";
import Cards from "../components/cards";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";
import { getData } from "../network";
import ErrorPage from "./error-page";
import CardsLocation from "../components/cards-loading";

export interface SpecialEffectBackend {
    name: string
    imgSrc: string
}

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
    const [loading, setLoading] = useState(true);
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const {locationQuery, searchQuery, specialEffectQuery, modalQuery, transitioning, setTransitioning} = useContext(GlobalContext);

    const [addModalActive, setAddModalActive] = useState(false);

    async function fetchIngedients() {
        try {
            if (!ingredients) {
                setLoading(true);
            } else {
                setTransitioning(true);
            }

            const newIngrediences = await getData(`ingredient?special-effect=${encodeURIComponent(specialEffectQuery)}&search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
            setIngredients(newIngrediences);
        } catch (e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
            setTransitioning(false);
        }
    }

    useEffect(() => {
        fetchIngedients();
    }, [locationQuery, searchQuery, specialEffectQuery, modalQuery, addModalActive]);
    
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
            {loading ?
                <CardsLocation/>
                :
                <Cards 
                    transition={transitioning}
                    items={ingredients} 
                    isIngredient={true} 
                />
            }
        </>
    );
}


export default Ingredients;