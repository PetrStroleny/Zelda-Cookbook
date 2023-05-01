
import { FC, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { specialEffects, validateIsNumber } from "../utils/form";
import { GlobalContext, addReceipt, editRecipe } from "../utils/global-context";
import AddOrEditModal from "./add-or-edit-modal";
import Dropdown from "./dropdown";
import Input from "./input";
import TextArea from "./text-area";

interface AddOrEditRecipeProps {
    hide: () => void
    initialValues?: AddOrEditRecipeInfo
}

export interface AddOrEditRecipeInfo{
    id?: number
    name: string, 
    description: string,
    numberOfHearts: string,
    price: string,
    ingredients: number[],
    specialEffect: string,
    specialEffectDuration?: number
}

const AddOrEditRecipe: FC<AddOrEditRecipeProps> = ({hide, initialValues}) => {
    const {ingredients, recipes, setRecipes } = useContext(GlobalContext);
    
    const { control, handleSubmit, reset, watch } = useForm<AddOrEditRecipeInfo>({defaultValues: initialValues ?? { 
        specialEffect: "Bez efektu",
        ingredients: [],
    }});

    const specialEffectValue = watch("specialEffect");
    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");

    useEffect(() => {
        reset();
    }, []);

    function onSubmit(data: AddOrEditRecipeInfo) {
        const currentID = initialValues?.id ?? recipes[0].id + 1;
        let editedData: any = data;
        editedData.numberOfHearts = Number(data.numberOfHearts);
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

        if (initialValues) {
            editRecipe({id: currentID, ...editedData}, recipes, setRecipes)
        } else {
            addReceipt({id: currentID, ...editedData}, recipes, setRecipes);
        }
        hide();
    }

    return (
        <AddOrEditModal 
            editing={initialValues != undefined}
            submit={handleSubmit(onSubmit)} 
            hide={hide}
        >   
            <h2>Přidat Recept</h2>
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
            <Dropdown
                items={ingredients.map(ingredient => ({value: ingredient.id, label: ingredient.name}))}
                label="Ingredience"
                control={control}
                rules={{required: { message: "Vyberte alespoň jednu ingredienci", value: true }}}
                multiple
                name="ingredients"
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


export default AddOrEditRecipe;