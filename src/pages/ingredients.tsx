import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddModal, { AddFrom, ModalType } from "../components/add-modal";
import Button, { ButtonVariant } from "../components/button";
import CardWrapper from "../components/card-wrapper";
import FoodCard from "../components/food-card";
import PageHeader from "../components/page-header";
import { addIngredient, GlobalContext } from "../utils/global-context";
import ErrorPage from "./error-page";


export interface SpecialEffect {
    name: string
    duration: number
}
export interface Ingredient {
    id: number
    numberOfHearts: number
    extraHearths?: number
    name: string
    description: string
    specialEffect?: SpecialEffect
    price: number
}


const Ingredients = () => {
    const [errored, setErrored] = useState(false);
    const [loading, setLoading] = useState(false);
    const {ingredients, setIngredients, setLocations, locations, locationQuery, searchQuery} = useContext(GlobalContext);

    const [activeIngredients, setAcitiveIngredients] = useState<Ingredient[]>([]);

    const [addModalActive, setAddModalActive] = useState(false);

    function fetchIngedients() {
        try {
            setLoading(true);
            let filteredIngrediences = [];

            ingredientLoop: for (const ingredient of ingredients) {
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
    }, [locationQuery, searchQuery, ingredients]);

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

            {addModalActive &&
                <AddModal 
                    type={ModalType.INGREDIENT}
                    submitFunction={(data: AddFrom) =>
                       { 
                            const currentID = activeIngredients[activeIngredients.length - 1].id + 1;
                            addIngredient({id: currentID, ...data}, ingredients, setIngredients);
                            let currentLocation = locations;

                            for (let i = 0; i < locations.length; i++) {
                                for (let x = 0; x < locations[i].subLocations.length; x++) {
                                    if (locations[i].subLocations[x].id == data.location) {
                                        let editingLocation = locations[i].subLocations[x];
                                        editingLocation.ingredients = [...editingLocation.ingredients, currentID];

                                        currentLocation[i].subLocations[x] = editingLocation;
                                        continue;
                                    }
                                }
                            }

                            setLocations(currentLocation);

                            console.log(locations);
                        }
                    } 
                    hide={() => setAddModalActive(false)}
                />
            }

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
            <CardWrapper>
                {!loading ? activeIngredients.map((ingredient, index) => (
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