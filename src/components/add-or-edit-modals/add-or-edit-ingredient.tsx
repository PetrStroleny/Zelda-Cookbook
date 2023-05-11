
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { addIngredient, editIngredient } from "../../utils/adding-editing";
import { validateIsNumber } from "../../utils/form";
import { GlobalContext } from "../../utils/global-context";
import AddOrEditModal from ".";
import Dropdown from "../dropdown";
import Input from "../input";
import TextArea from "../text-area";

interface AddOrEditIngredientProps {
    hide: () => void
    initialValues?: AddOrEditIngredientInfo
}

export interface AddOrEditIngredientInfo {
    id?: number
    name: string, 
    description: string,
    numberOfHearts: string,
    extraHearts?: string,
    locations: number[],
    price: string,
    specialEffect: string,
    specialEffectDuration?: number
}

const AddOrEditIngredient: FC<AddOrEditIngredientProps> = ({hide, initialValues}) => {
    const {ingredients, setIngredients, setRegions, regions, specialEffects} = useContext(GlobalContext);
    
    const { control, handleSubmit, reset, watch } = useForm<AddOrEditIngredientInfo>({defaultValues: initialValues ?? { 
        locations: [],
        specialEffect: "Bez efektu",
    }});

    const locationDropdownItems = regions.map(region => region.locations).flat(1).map(location => ({value: location.id, label: location.name}));

    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");
    const specialEffectValue = watch("specialEffect");

    useEffect(() => {
        reset();
        document.body.classList.add("scroll-disabled");

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    function onSubmit(data: AddOrEditIngredientInfo) {
        const currentID = initialValues?.id ?? ingredients[0].id + 1;
        let editedData: any = data;
        editedData.numberOfHearts = Number(data.numberOfHearts);

        if (data.extraHearts != undefined && data.extraHearts.length != 0) {
            editedData.extraHearts = Number(data.extraHearts);
        } else {
            delete editedData.extraHearts;
        }
        editedData.price = Number(editedData.price);
        
        if (data.specialEffect == "Bez efektu") {
            delete editedData.specialEffect;
        } else {
            editedData.name = `${data.specialEffect.charAt(0).toUpperCase() + data.specialEffect.slice(1)} ${data.name}`;
            editedData.specialEffect = {
                name: data.specialEffect,
                duration: Number(data.specialEffectDuration)
            }
        }

        let newLocations = initialValues ? data.locations.filter(location => !initialValues.locations.some(initialLocation => initialLocation == location)) : data.locations;
        let removedLocations =  initialValues ? initialValues.locations.filter(initialLocation => !data.locations.some(location => initialLocation == location)) : [];

        if (initialValues) {
            editIngredient({id: currentID, ...editedData}, ingredients, setIngredients);
        } else {
            addIngredient({id: currentID, ...editedData}, ingredients, setIngredients);
        }

        let currentRegions = regions;

        for (let i = 0; i < regions.length; i++) {
            for (let x = 0; x < regions[i].locations.length; x++) {
                if (newLocations.includes(regions[i].locations[x].id)) {
                    let editingLocation = regions[i].locations[x];

                    editingLocation.ingredients = [...editingLocation.ingredients, currentID];

                    currentRegions[i].locations[x] = editingLocation;
                    continue;
                } else if (removedLocations.includes(regions[i].locations[x].id)) {
                    let editingLocation = regions[i].locations[x];

                    editingLocation.ingredients = editingLocation.ingredients.filter(ingredient => ingredient != currentID);

                    currentRegions[i].locations[x] = editingLocation;
                }
            }
        }

        setRegions(currentRegions);
        hide();
    }

    return (
        <>
            <Helmet>
                <meta property="og:title" content="Přidat ingredienci | ZELDA COOK"/>
                <title>Přidat ingredienci | ZELDA COOK</title>
            </Helmet>
            <AddOrEditModal 
                editing={initialValues != undefined}
                submit={handleSubmit(onSubmit)} 
                hide={hide}
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

                <Input 
                    label="Počet bonusových srdíček"
                    control={control}
                    name="extraHearts"
                    maxLength={3}
                    customError={customHeartsError}
                    rules={{ 
                        validate: (value: string) => validateIsNumber(
                            value, 
                            setCustomHeartsError, 
                            999,
                            false,
                            {
                                negativeError: "Počet bonusových srdíček musí být větší nežli 0",
                            }
                        )
                    }}  
                />          

                <Dropdown
                    items={locationDropdownItems}
                    label="Lokace"
                    control={control}
                    rules={{required: { message: "Vyberte lokaci", value: true }}}
                    multiple
                    name="locations"
                />
                <Dropdown
                    items={[{value: "Bez efektu", label: "Bez efektu"}, ...specialEffects.map(specialEffect => ({value: specialEffect.name, label: specialEffect.name}))]}
                    label="Speciální effekt"
                    control={control}
                    name="specialEffect"
                />
                {specialEffectValue != "Bez efektu" ?
                    <Input
                        label="Doba trvání speciálního efektu"
                        control={control}
                        name="specialEffectDuration"
                        customError={customDurationError}
                        maxLength={4}
                        rules={{ 
                            required: { message: "Vyplňte dobu trvání speciálního efektu", value: true },
                            validate: (value: string) => validateIsNumber(
                                value, 
                                setCustomDurationError, 
                                1800,
                                true,
                                {
                                    negativeError: "Maximální doba trvání je 1800 minut",
                                }
                            )
                        }}  
                    /> : <></>
                }
            </AddOrEditModal>
        </>
    );
}


export default AddOrEditIngredient;