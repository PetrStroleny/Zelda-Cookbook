import { createContext } from "react";
import { Ingredient } from "../pages/ingredients";
import { IngredienceLocation, SubLocation } from "../pages/locations";
import { Recipe } from "../pages/recipes";

export const GlobalContext = createContext<{
  searchQuery: string,
  setSearchQuery: (value: string) => void,
  
  modalQuery: string,
  setModalQuery: (value: string) => void,

  locationQuery: string,
  setLocationQuery: (value: string) => void,

  specialEffectQuery: string,
  setSpecialEffectQuery: (value: string) => void,

  locations: IngredienceLocation[],
  setLocations: (value: IngredienceLocation[]) => void,

  recipes: Recipe[],
  setRecipes: (value: Recipe[]) => void,

  ingredients: Ingredient[],
  setIngredients: (value: Ingredient[]) => void,
}>({
  searchQuery: "",
  setSearchQuery: () => {},

  modalQuery: "",
  setModalQuery: () => {},

  locationQuery: "",
  setLocationQuery: () => {},

  specialEffectQuery: "",
  setSpecialEffectQuery: () => {},

  locations: [],
  setLocations: () => {},

  recipes: [],
  setRecipes: () => {},

  ingredients: [],
  setIngredients: () => {},
});

export function editIngredient(activeIngredient: Ingredient, activeIngredients: Ingredient[], setActiveIngredients: (values: Ingredient[]) => void) {
  setActiveIngredients(activeIngredients.map(ingredient => ingredient.id == activeIngredient.id ? 
    activeIngredient 
    : 
    ingredient
  ));
}
export function addIngredient(ingredient: Ingredient, activeIngredients: Ingredient[], setActiveIngredients: (values: Ingredient[]) => void) {
  setActiveIngredients([ingredient, ...activeIngredients]);
}

export function editRecipe(activeRecipe: Recipe, activeReceipts: Recipe[], setActiveReceipts: (values: Recipe[]) => void) {
  setActiveReceipts(activeReceipts.map(recipe => recipe.id == activeRecipe.id ? 
    activeRecipe 
    : 
    recipe
  ));
}
export function addReceipt(receipt: Recipe, activeReceipts: Recipe[], setActiveReceipts: (values: Recipe[]) => void) {
  setActiveReceipts([receipt, ...activeReceipts]);
}

export function editLocation(activeLocation: SubLocation, regionName: string, previousRegionName: string, activeLocations: IngredienceLocation[], setActiveLocations: (values: IngredienceLocation[]) => void) {
  let editedLocations = activeLocations;
  const regionChanged = regionName != previousRegionName;

  for (let i = 0; i < activeLocations.length; i++) {
    if (activeLocations[i].name == regionName) {
      if (regionChanged) {
        editedLocations[i].subLocations = [activeLocation, ...activeLocations[i].subLocations];
      } else {
        editedLocations[i].subLocations.map(subLocation => subLocation.id == activeLocation.id ?
          activeLocation 
          :
          subLocation
        );
      }
      continue; 
    }
    if (activeLocations[i].name == previousRegionName && regionChanged) {
      editedLocations[i].subLocations = editedLocations[i].subLocations.filter(subLocation => subLocation.id != activeLocation.id);
    }
  }

  setActiveLocations(editedLocations);
}
export function addLocation(location: SubLocation, regionName: string, activeLocations: IngredienceLocation[], setActiveLocations: (values: IngredienceLocation[]) => void) {
  let editedLocations = activeLocations;

  for (let i = 0; i < activeLocations.length; i++) {
    if (activeLocations[i].name == regionName) {
      editedLocations[i].subLocations = [location, ...activeLocations[i].subLocations]
    }
  }

  setActiveLocations(editedLocations);
}