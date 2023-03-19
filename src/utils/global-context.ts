import { createContext } from "react";
import { Ingredient } from "../pages/ingredients";
import { IngredienceLocation } from "../pages/locations";
import { Recipe } from "../pages/recipes";

export const GlobalContext = createContext<{
  searchQuery: string,
  setSearchQuery: (value: string) => void
  
  locationQuery: string,
  setLocationQuery: (value: string) => void,

  locations: IngredienceLocation[],
  setLocations: (value: IngredienceLocation[]) => void,

  recipes: Recipe[],
  setRecipes: (value: Recipe[]) => void,

  ingredients: Ingredient[],
  setIngredients: (value: Ingredient[]) => void,
}>({
  searchQuery: "",
  setSearchQuery: () => {},

  locationQuery: "",
  setLocationQuery: () => {},

  locations: [],
  setLocations: () => {},

  recipes: [],
  setRecipes: () => {},

  ingredients: [],
  setIngredients: () => {},
});

export function addIngredient(ingredient: Ingredient, activeIngredients: Ingredient[], setActiveIngredients: (values: Ingredient[]) => void) {
  setActiveIngredients([...activeIngredients, ingredient]);
}

export function addReceipt(receipt: Recipe, activeReceipts: Recipe[], setActiveReceipts: (values: Recipe[]) => void) {
  setActiveReceipts([...activeReceipts, receipt]);
}

export function addLocation(location: IngredienceLocation, activeLocations: IngredienceLocation[], setActiveLocations: (values: IngredienceLocation[]) => void) {
  setActiveLocations([...activeLocations, location]);
}