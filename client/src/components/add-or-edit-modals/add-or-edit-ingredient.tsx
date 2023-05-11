
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { addIngredient, editIngredient } from "../../utils/adding-editing";
import { validateIsNumber } from "../../utils/form";
import { GlobalContext } from "../../utils/global-context";
import AddOrEditModal from ".";
import Dropdown from "../dropdown";
import {Region} from "../../pages/locations";
import {Ingredient, SpecialEffect} from "../../pages/ingredients";
import Input from "../input";
import TextArea from "../text-area";

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
    const [locationDropdownItems, setLocationDropdownItems] = useState<Region[]>();
    const [specialEffects, setSpecialEffects] = useState<Region[]>();
    
    const { control, handleSubmit, reset, watch, getValues } = useForm<AddOrEditIngredientInfo>({defaultValues: { 
        locations: [],
        specialEffect: "Bez efektu",
    }});

    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");
    const specialEffectValue = watch("specialEffect");

    useEffect(() => {
        reset();
        document.body.classList.add("scroll-disabled");


        if (edit) {

        }

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    function onSubmit(data: AddOrEditIngredientInfo) {
        const currentID = getValues()?.id ?? 0;
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

        if (edit) {
            //editIngredient({id: currentID, ...editedData}, ingredients, setIngredients);
        } else {
            //addIngredient({id: currentID, ...editedData}, ingredients, setIngredients);
        }

        hide();
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