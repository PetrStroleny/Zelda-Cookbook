
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { addReceipt, editRecipe } from "../../utils/adding-editing";
import { validateIsNumber } from "../../utils/form";
import { GlobalContext } from "../../utils/global-context";
import AddOrEditModal from ".";
import Dropdown from "../dropdown";
import Input from "../input";
import TextArea from "../text-area";
import {Region} from "../../pages/locations";
import {Ingredient, SpecialEffect} from "../../pages/ingredients";

interface AddOrEditRecipeProps {
    hide: () => void
    edit?: boolean
    specialEffects: SpecialEffect[]
    ingredients: Ingredient[]
    regions: Region[]
}

export interface AddOrEditRecipeInfo{
    id?: number
    name: string, 
    description: string,
    numberOfHearts: string,
    extraHearts?: string,
    price: string,
    ingredients: number[],
    specialEffect: string,
    specialEffectDuration?: number
}

const AddOrEditRecipe: FC<AddOrEditRecipeProps> = ({hide, edit, regions, ingredients, specialEffects}) => {
    
    const { control, handleSubmit, reset, watch, getValues } = useForm<AddOrEditRecipeInfo>({defaultValues: { 
        specialEffect: "Bez efektu",
        ingredients: [],
    }});

    const specialEffectValue = watch("specialEffect");
    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");

    useEffect(() => {
        reset();
        document.body.classList.add("scroll-disabled");

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    function onSubmit(data: AddOrEditRecipeInfo) {
        const currentID = getValues()?.id ?? 0;
        let editedData: any = data;
        editedData.numberOfHearts = Number(data.numberOfHearts);
        if (data.extraHearts != undefined) editedData.extraHearts = Number(data.extraHearts);
        editedData.price = Number(editedData.price);
        editedData.ingrediences = [data.ingredients];

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
           // editRecipe({id: currentID, ...editedData}, recipes, setRecipes)
        } else {
           // addReceipt({id: currentID, ...editedData}, recipes, setRecipes);
        }
        hide();
    }

    return (
        <>
            <Helmet>
                <meta property="og:title" content={`${edit ? "Editovat" : "Přidat"} recept | ZELDA COOK`}/>
                <title>{edit ? "Editovat" : "Přidat"} recept | ZELDA COOK</title>
            </Helmet>
            <AddOrEditModal 
                editing={edit == true}
                submit={handleSubmit(onSubmit)} 
                hide={hide}
            >   
                <h2>{edit ? "Editovat" : "Přidat"} Recept</h2>
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
                                negativeError: "Cena receptu musí být menší nežli 999",
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
                    items={ingredients.map(ingredient => ({value: ingredient.id, label: ingredient.name}))}
                    label="Ingredience"
                    control={control}
                    rules={{required: { message: "Vyberte alespoň jednu ingredienci", value: true }}}
                    multiple
                    name="ingredients"
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

export default AddOrEditRecipe;