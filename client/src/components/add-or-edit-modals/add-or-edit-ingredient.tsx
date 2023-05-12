
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { validateIsNumber } from "../../utils/form";
import { GlobalContext } from "../../utils/global-context";
import AddOrEditModal from ".";
import Dropdown, { DropdownItem } from "../dropdown";
import {Region, ZeldaLocation} from "../../pages/locations";
import {Ingredient, SpecialEffect, SpecialEffectBackend} from "../../pages/ingredients";
import Input from "../input";
import TextArea from "../text-area";
import { GENERAL_ERROR_MESSAGE, getData, postData } from "../../network";
import { removeSpecialEffectFromName } from "../food-card";

interface AddOrEditIngredientProps {
    hide: () => void
    edit?: boolean
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

const AddOrEditIngredient: FC<AddOrEditIngredientProps> = ({hide, edit}) => {
    const [locationDropdownItems, setLocationDropdownItems] = useState<DropdownItem[]>([]);
    const [specialEffectsDropdownItems, setSpecialEffectsDropdownItems] = useState<DropdownItem[]>([]);
    const {modalQuery} = useContext(GlobalContext);
    
    const { control, handleSubmit, reset, watch, getValues, setValue } = useForm<AddOrEditIngredientInfo>({defaultValues: { 
        locations: [],
        specialEffect: "Bez efektu",
    }});

    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customBonusHeartsError, setCustomBonusHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");
    const specialEffectValue = watch("specialEffect");

    useEffect(() => {
        const fetchLocationsAndSpecialEffects = async () => {
            try {
                const regionsData: Region[] = await getData("location");
                const specialEffectsData: SpecialEffectBackend[] = await getData("special-effect");
                if (edit) {
                    const activeID = modalQuery.split("-")[modalQuery.split("-").length - 2];
                    const editingIngredient: {ingredient: Ingredient, locations: ZeldaLocation[]} = await getData(`ingredient/${activeID}`);

                    let newValues: AddOrEditIngredientInfo = {
                        id: Number(editingIngredient.ingredient.id),
                        name: removeSpecialEffectFromName(editingIngredient.ingredient.name, editingIngredient.ingredient.specialEffect != null, false),
                        description: editingIngredient.ingredient.description,
                        price: String(editingIngredient.ingredient.price),
                        numberOfHearts: String(editingIngredient.ingredient.numberOfHearts),
                        locations: editingIngredient.locations.map(location => location.id),
                        specialEffect: editingIngredient.ingredient.specialEffect ? editingIngredient.ingredient.specialEffect.name : "Bez efektu",
                    };

                    if (editingIngredient.ingredient.specialEffect) {
                        newValues.specialEffectDuration = editingIngredient.ingredient.specialEffect.duration
                    }

                    if (editingIngredient.ingredient.extraHearts) {
                        newValues.extraHearts = String(editingIngredient.ingredient.extraHearts);
                    }

                    reset(newValues);
                }

                setLocationDropdownItems(regionsData.map(region => region.locations).flat(1).map(location => ({value: location.id, label: location.name})));
                setSpecialEffectsDropdownItems(specialEffectsData.map(specialEffect => ({value: specialEffect.name, label: specialEffect.name})));
            } catch(e) {
                console.error(e);
            }
        }

        reset();
        document.body.classList.add("scroll-disabled");
        fetchLocationsAndSpecialEffects();

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    async function onSubmit(data: AddOrEditIngredientInfo) {
        let editedData: any = data;
        editedData.id = getValues()?.id ?? 0;
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
        
        try {
            await postData("ingredient/create-or-edit", editedData);
            hide();
        } catch(e) {
            alert(GENERAL_ERROR_MESSAGE);
        }
    }

    return (
        <>
            <Helmet>
                <meta property="og:title" content={`${edit ? "Editovat" : "Přidat"} ingredienci | ZELDA COOK`}/>
                <title>{edit ? "Editovat" : "Přidat"} ingredienci | ZELDA COOK</title>
            </Helmet>
            <AddOrEditModal 
                editing={edit == true}
                submit={handleSubmit(onSubmit)} 
                hide={hide}
            >   
                <h2>{edit ? "Editovat" : "Přidat"} ingredienci</h2>
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
                                negativeError: "Cena ingredience musí být menší než-li 999",
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
                                negativeError: "Počet srdíček musí být větší než-li 0",
                            }
                        )
                    }}  
                />

                <Input 
                    label="Počet bonusových srdíček"
                    control={control}
                    name="extraHearts"
                    maxLength={3}
                    customError={customBonusHeartsError}
                    rules={{ 
                        validate: (value: string) => validateIsNumber(
                            value, 
                            setCustomBonusHeartsError, 
                            999,
                            false,
                            {
                                negativeError: "Počet bonusových srdíček musí být větší než-li 0",
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
                    items={[{value: "Bez efektu", label: "Bez efektu"}, ...specialEffectsDropdownItems]}
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
                                },
                                1
                            )
                        }}  
                    /> : <></>
                }
            </AddOrEditModal>
        </>
    );
}


export default AddOrEditIngredient;