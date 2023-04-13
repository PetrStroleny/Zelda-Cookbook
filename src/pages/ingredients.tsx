import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import AddModal from "../components/add-modal";
import Modal, {ModalProps} from '../components/modal';
import Button, { ButtonVariant } from "../components/button";
import CardWrapper from "../components/card-wrapper";
import Dropdown from "../components/dropdown";
import FoodCard from "../components/food-card";
import Input from "../components/input";
import PageHeader from "../components/page-header";
import TextArea from "../components/text-area";
import { validateIsNumber } from "../utils/form";
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

interface AddIngredientInfo {
    name: string, 
    description: string,
    numberOfHearts: number,
    location: number,
    price: number,
}

const locationDropdownItems = [
    {value: 1, label: "Akkala Highlands"},
    {value: 2, label: "Deep Akkkala"},
    {value: 3, label: "Lanayru Great Spring"},
    {value: 4, label: "Lanayru Sea"},
    {value: 5, label: "Lanayru Wetlands"},
    {value: 6, label: "Mount Lanayru"},
    {value: 7, label: "East Necluda"},
    {value: 8, label: "West Necluda"},
    {value: 9, label: "Necluda Sea"},
]

const Ingredients = () => {
    const [errored, setErrored] = useState(false);
    const [loading, setLoading] = useState(false);
    const {ingredients, setIngredients, setLocations, locations, locationQuery, searchQuery} = useContext(GlobalContext);

    const [modalData, setModalData] = useState<Omit<ModalProps, "close"> | null>(null);

    const { control, handleSubmit } = useForm<AddIngredientInfo>({defaultValues: {
        location: 1,
    }});
    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");

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

    function onSubmit(data: AddIngredientInfo) {
        const currentID = activeIngredients[activeIngredients.length - 1].id + 1;
        let editedData = data;
        editedData.numberOfHearts = Number(data.numberOfHearts);
        editedData.price = Number(editedData.price);

        addIngredient({id: currentID, ...editedData}, ingredients, setIngredients);
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
        setAddModalActive(false);
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

            {modalData != null && 
                <Modal 
                    imgSrc={modalData.imgSrc} 
                    label={modalData.label}
                    description={modalData.description} 
                    close={() => setModalData(null)}
                />
            }

            {addModalActive &&
                <AddModal 
                    submit={handleSubmit(onSubmit)} 
                    hide={() => setAddModalActive(false)}
                >   
                    <h2>Přidat ingredienci</h2>
                    <Input 
                        label="Název"
                        control={control}
                        rules={{ required: { message: "Vyplňte název", value: true } }}
                        name="name"
                    />

                    <TextArea
                        label="Popis"
                        control={control}
                        rules={{ required: { message: "Vyplňte popis", value: true } }}
                        name="description"
                        maxLength={750}
                    />

                    <Input
                        label="Cena"
                        control={control}
                        name="price"
                        customError={customPriceError}
                        maxLength={3}
                        rules={{ 
                            required: { message: "Vyplňte cenu ingredience", value: true },
                            validate: (value: string) => validateIsNumber(
                                value, 
                                setCustomPriceError, 
                                999,
                                false,
                                {
                                    negativeError: "Cena ingredience musí být menší nežli 999",
                                }
                            )
                        }}  
                    />
                        
                    <Input 
                        label="Počet srdíček"
                        control={control}
                        name="numberOfHearts"
                        maxLength={3}
                        customError={customHeartsError}
                        rules={{ 
                            required: { message: "Vyplňte počet srdíček", value: true },
                            validate: (value: string) => validateIsNumber(
                                value, 
                                setCustomHeartsError, 
                                999,
                                false,
                                {
                                    negativeError: "Počet srdíček musí být větší nežli 0",
                                }
                            )
                        }}  
                    />
                    <Dropdown
                        items={locationDropdownItems}
                        label="Lokace"
                        control={control}
                        errored
                        name="location"
                    />
                </AddModal>
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
                            onClick={() => setModalData({
                                imgSrc: `public/ingredients/${ingredient.name.replaceAll(" ", "_")}.png`,
                                label: ingredient.name,
                                description: ingredient.description
                            })}
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