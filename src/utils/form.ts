import { AddOrEditIngredientInfo } from "../components/add-or-edit-modals/add-or-edit-ingredient";
import { AddOrEditLocationInfo } from "../components/add-or-edit-modals/add-or-edit-location";
import { AddOrEditRecipeInfo } from "../components/add-or-edit-modals/add-or-edit-recipe";
import { removeSpecialEffectFromName } from "../components/food-card";
import { Ingredient } from "../pages/ingredients";
import { Region } from "../pages/locations";
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

export function ingredientInitialValues(activeID: number, ingredients: Ingredient[], regions: Region[]): AddOrEditIngredientInfo {
    const activeIngredient = ingredients.filter(ingredient => ingredient.id == activeID)[0];
    let data = {} as AddOrEditIngredientInfo;

    data.id = activeID;
    data.name = removeSpecialEffectFromName(activeIngredient.name, activeIngredient.specialEffect != undefined, false);
    data.description = activeIngredient.description;
    data.locations = regions.map(region => region.locations).flat(1).filter(location => location.ingredients.includes(activeID)).map(location => location.id);
    data.numberOfHearts = activeIngredient.numberOfHearts.toString();
    if (activeIngredient.extraHearts != undefined) data.extraHearts = activeIngredient.extraHearts.toString();
    data.price = activeIngredient.price.toString();
    data.specialEffect = activeIngredient.specialEffect?.name ?? "Bez efektu";
    if (activeIngredient.specialEffect) {
        data.specialEffectDuration = activeIngredient.specialEffect?.duration;
    }

    return data;
}

export function recipeInitialValues(activeID: number, recipes: Recipe[]): AddOrEditRecipeInfo {
    const activeRecipe = recipes.filter(recipe => recipe.id == activeID)[0];

    let data = {} as AddOrEditRecipeInfo;

    data.id = activeID;
    data.name = removeSpecialEffectFromName(activeRecipe.name, activeRecipe.specialEffect != undefined, false);
    data.description = activeRecipe.description;
    data.ingredients = activeRecipe.ingredients;
    data.numberOfHearts = activeRecipe.numberOfHearts.toString();
    if (activeRecipe.extraHearts != undefined) data.extraHearts = activeRecipe.extraHearts.toString();
    data.price = activeRecipe.price.toString();
    data.specialEffect = activeRecipe.specialEffect?.name ?? "Bez efektu";
    if (activeRecipe.specialEffect?.name) {
        data.specialEffectDuration = activeRecipe.specialEffect?.duration;
    }

    return data;
}

export function locationInitialValues(activeID: number, regions: Region[]): AddOrEditLocationInfo {
    const activeLocation = regions.map(region => region.locations).flat(1).filter(location => location.id == activeID)[0];

    let data = {} as AddOrEditLocationInfo;
    data.id = activeID;
    data.name = activeLocation?.name;
    data.regionName = regions.filter(region => region.locations.some(location => location.id == activeLocation.id))[0]?.name;
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

    if((String(value).indexOf(".") != -1) && mustBeWhole) {
        setError(errors?.wholeError ?? "Zadejte celé číslo");
        return false;
    }

    if (!mustBeWhole && Number(value) % 1 != 0 && Number(value) % 1 != 0.5) {
        setError(errors?.wholeError ?? "Na desetinném místě může být pouze číslo 5.");
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