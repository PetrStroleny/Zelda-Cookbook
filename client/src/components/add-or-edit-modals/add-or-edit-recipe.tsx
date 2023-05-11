
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import AddOrEditModal from ".";
import { GENERAL_ERROR_MESSAGE, getData, postData } from "../../network";
import { Ingredient, SpecialEffectBackend } from "../../pages/ingredients";
import { Recipe } from "../../pages/recipes";
import { validateIsNumber } from "../../utils/form";
import { GlobalContext } from "../../utils/global-context";
import Dropdown, { DropdownItem } from "../dropdown";
import Input from "../input";
import TextArea from "../text-area";

interface AddOrEditRecipeProps {
    hide: () => void
    edit?: boolean
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

const AddOrEditRecipe: FC<AddOrEditRecipeProps> = ({hide, edit}) => {
    
    const { control, handleSubmit, reset, watch, getValues } = useForm<AddOrEditRecipeInfo>({defaultValues: { 
        specialEffect: "Bez efektu",
        ingredients: [],
    }});

    const {modalQuery} = useContext(GlobalContext);
    const specialEffectValue = watch("specialEffect");
    const [customHeartsError, setCustomHeartsError] = useState("");
    const [customPriceError, setCustomPriceError] = useState("");
    const [customDurationError, setCustomDurationError] = useState("");
    const [ingredientDropdownItems, setIngredientDropdownItems] = useState<DropdownItem[]>([]);
    const [specialEffectsDropdownItems, setSpecialEffectsDropdownItems] = useState<DropdownItem[]>([]);

    useEffect(() => {
        const fetchIngredientsAndRegions = async () => {
            try {
                const ingredientsData: Ingredient[] = await getData("ingredient");
                const specialEffectsData: SpecialEffectBackend[] = await getData("special-effect");

                if (edit) {
                    const activeID = modalQuery.split("-")[modalQuery.split("-").length - 2];
                    const editingRecipe: {recipe: Recipe, ingredients: Ingredient[]} = await getData(`recipe/${activeID}`);

                    let newValues: AddOrEditRecipeInfo = {
                        id: Number(editingRecipe.recipe.id),
                        name: editingRecipe.recipe.name,
                        description: editingRecipe.recipe.description,
                        price: String(editingRecipe.recipe.price),
                        numberOfHearts: String(editingRecipe.recipe.numberOfHearts),
                        specialEffect:editingRecipe.recipe.specialEffect ? editingRecipe.recipe.specialEffect.name : "Bez efektu",
                        ingredients: editingRecipe.ingredients.map(ingredient => ingredient.id)
                    };

                    if (editingRecipe.recipe.specialEffect) {
                        newValues.specialEffectDuration = editingRecipe.recipe.specialEffect.duration
                    }

                    if (editingRecipe.recipe.extraHearts) {
                        newValues.extraHearts = String(editingRecipe.recipe.extraHearts);
                    }

                    reset(newValues);
                }

                setIngredientDropdownItems(ingredientsData.map(ingredient => ({value: ingredient.id, label: ingredient.name})));
                setSpecialEffectsDropdownItems(specialEffectsData.map(specialEffect => ({value: specialEffect.name, label: specialEffect.name})));
            } catch(e) {
                console.error(e);
            }
        }

        reset();
        document.body.classList.add("scroll-disabled");
        fetchIngredientsAndRegions();

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    async function onSubmit(data: AddOrEditRecipeInfo) {
        let editedData: any = data;
        editedData.id = getValues()?.id ?? 0;
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

        try {
            await postData("recipe/create-or-edit", editedData);
            hide();
        } catch(e) {
            alert(GENERAL_ERROR_MESSAGE);
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
                    items={ingredientDropdownItems}
                    label="Ingredience"
                    control={control}
                    rules={{required: { message: "Vyberte alespoň jednu ingredienci", value: true }}}
                    multiple
                    name="ingredients"
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

export default AddOrEditRecipe;