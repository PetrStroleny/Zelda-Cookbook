
import { FC, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext, addIngredient, editIngredient } from "../utils/global-context";
import AddOrEditModal from "./add-or-edit-modal";
import Input from "./input";
import TextArea from "./text-area";
import { locationDropdownItems, specialEffects, validateIsNumber } from "../utils/form";
import Dropdown from "./dropdown";

interface AddOrEditIngredientProps {
    hide: () => void
    initialValues?: AddOrEditIngredientInfo
}

export interface AddOrEditIngredientInfo {
    id?: number
    name: string, 
    description: string,
    numberOfHearts: string,
    locations: number[],
    price: string,
    specialEffect: string,
    specialEffectDuration?: number
}

const AddOrEditIngredient: FC<AddOrEditIngredientProps> = ({hide, initialValues}) => {
    const {ingredients, setIngredients, setLocations, setModalQuery, locations, locationQuery, searchQuery, specialEffectQuery} = useContext(GlobalContext);
    
    const { control, handleSubmit, reset, watch } = useForm<AddOrEditIngredientInfo>({defaultValues: initialValues ?? { 
        locations: [],
        specialEffect: "Bez efektu",
    }});

    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");
    const specialEffectValue = watch("specialEffect");

    useEffect(() => {
        reset();
    }, []);

    function onSubmit(data: AddOrEditIngredientInfo) {
        const currentID = initialValues?.id ?? ingredients[0].id + 1;
        let editedData: any = data;
        editedData.numberOfHearts = Number(data.numberOfHearts);
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

        let currentLocation = locations;

        for (let i = 0; i < locations.length; i++) {
            for (let x = 0; x < locations[i].subLocations.length; x++) {
                if (newLocations.includes(locations[i].subLocations[x].id)) {
                    let editingLocation = locations[i].subLocations[x];

                    editingLocation.ingredients = [...editingLocation.ingredients, currentID];

                    currentLocation[i].subLocations[x] = editingLocation;
                    continue;
                } else if(removedLocations.includes(locations[i].subLocations[x].id)) {
                    let editingLocation = locations[i].subLocations[x];

                    editingLocation.ingredients = editingLocation.ingredients.filter(ingredient => ingredient != currentID);

                    currentLocation[i].subLocations[x] = editingLocation;
                }
            }
        }

        setLocations(currentLocation);
        hide();
    }

    return (
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
            <Dropdown
                items={locationDropdownItems}
                label="Lokace"
                control={control}
                rules={{required: { message: "Vyberte lokaci", value: true }}}
                multiple
                name="locations"
            />

            <Dropdown
                items={specialEffects}
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
                            false,
                            {
                                negativeError: "Maximální doba trvání je 1800 minut",
                            }
                        )
                    }}  
                /> : <></>
            }
        </AddOrEditModal>
    );
}


export default AddOrEditIngredient;