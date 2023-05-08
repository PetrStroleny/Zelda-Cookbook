
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
    const {ingredients, recipes, setRecipes, specialEffects } = useContext(GlobalContext);
    
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
        document.body.classList.add("scroll-disabled");

        return () => document.body.classList.remove("scroll-disabled");
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
        <>
            <Helmet>
                <meta property="og:title" content="Přidat recept | ZELDA COOK"/>
                <title>Přidat recept | ZELDA COOK</title>
            </Helmet>
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