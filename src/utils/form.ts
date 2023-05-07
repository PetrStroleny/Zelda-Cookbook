import { AddOrEditIngredientInfo } from "../components/add-or-edit-ingredient";
import { AddOrEditLocationInfo } from "../components/add-or-edit-location";
import { AddOrEditRecipeInfo } from "../components/add-or-edit-recipe";
import { Ingredient } from "../pages/ingredients";
import { IngredienceLocation } from "../pages/locations";
import { Recipe } from "../pages/recipes";

interface ValidateNumberErrors {
    baseError?: string
    maxValueError?: string
    negativeError?: string
    wholeError?: string
}

export enum InitialDataType {
    LOCATION,
    RECIPE,
    INGREDIENT
}

export function ingredientInitialValues(activeID: number, ingredients: Ingredient[], locations: IngredienceLocation[]): AddOrEditIngredientInfo {
    const activeIngredient = ingredients.filter(ingredient => ingredient.id == activeID)[0];
    let data = {} as AddOrEditIngredientInfo;

    data.id = activeID;
    data.name = activeIngredient.name;
    data.description = activeIngredient.description;
    data.locations = locations.map(location => location.subLocations).flat(1).filter(subLocation => subLocation.ingredients.includes(activeID)).map(subLocation => subLocation.id);
    data.numberOfHearts = activeIngredient.numberOfHearts.toString();
    data.price = activeIngredient.price.toString();
    data.specialEffect = activeIngredient.specialEffect?.name ?? "Bez efektu";
    if (activeIngredient.specialEffect?.name) {
        data.specialEffectDuration = activeIngredient.specialEffect?.duration;
    }

    return data;
}

export function recipeInitialValues(activeID: number, recipes: Recipe[]): AddOrEditRecipeInfo {
    const activeRecipe = recipes.filter(recipe => recipe.id == activeID)[0];

    let data = {} as AddOrEditRecipeInfo;

    data.id = activeID;
    data.name = activeRecipe.name;
    data.description = activeRecipe.description;
    data.ingredients = activeRecipe.ingredients.flat(1);
    data.numberOfHearts = activeRecipe.numberOfHearts.toString();
    data.price = activeRecipe.price.toString();
    data.specialEffect = activeRecipe.specialEffect?.name ?? "Bez efektu";
    if (activeRecipe.specialEffect?.name) {
        data.specialEffectDuration = activeRecipe.specialEffect?.duration;
    }

    return data;
}

export function locationInitialValues(activeID: number, locations: IngredienceLocation[]): AddOrEditLocationInfo {
    const activeLocation = locations.map(location => location.subLocations).flat(1).filter(location => location.id == activeID)[0];

    let data = {} as AddOrEditLocationInfo;
    data.id = activeID;
    data.name = activeLocation?.name;
    data.regionName = locations.filter(location => location.subLocations.some(subLocation => subLocation.id == activeLocation.id))[0]?.name;
    data.description = activeLocation.description;
    data.ingredients = activeLocation.ingredients;
    
    return data;
}

export function validateIsNumber(value: string, setError: (value: string) => void, maxNumber: number, mustBeWhole?: boolean, errors?: ValidateNumberErrors): boolean {
    if(isNaN(Number(value))) {
        setError(errors?.baseError ?? "Zadejte číslo");
        return false;
    }

    if(Number(value) > maxNumber) {
        setError(errors?.maxValueError ?? `Číslo nesmí být větší nežli ${maxNumber}`);
        return false;
    }

    if(Number(value) < 0) {
        setError(errors?.negativeError ?? "Číslo nesmí být menší nežli 0");
        return false;
    }
    console.log(value);

    if((String(value).indexOf(".") != -1) && mustBeWhole) {
        setError(errors?.wholeError ?? "Zadejte celé číslo");
        return false;
    }

    setError("");
    return true;
}

export const locationDropdownItems = [
    {value: 9, label: "Akkala Highlands"},
    {value: 8, label: "Deep Akkkala"},
    {value: 7, label: "Lanayru Great Spring"},
    {value: 6, label: "Lanayru Sea"},
    {value: 5, label: "Lanayru Wetlands"},
    {value: 4, label: "Mount Lanayru"},
    {value: 3, label: "East Necluda"},
    {value: 2, label: "West Necluda"},
    {value: 1, label: "Necluda Sea"},
];

export const specialEffects = [
    {value: "Bez efektu", label: "Bez efektu"},
    {value: "electro", label: "electro"},
    {value: "chilly", label: "chilly"},
    {value: "mighty", label: "mighty"},
    {value: "sneaky", label: "sneaky"},
    {value: "spicy", label: "spicy"},
    {value: "tough", label: "tough"},
    {value: "hasty", label: "hasty"},
];