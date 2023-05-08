import { Ingredient } from "../pages/ingredients";
import { IngredienceLocation, SubLocation } from "../pages/locations";
import { Recipe } from "../pages/recipes";

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
          editedLocations[i].subLocations = editedLocations[i].subLocations.map(subLocation => subLocation.id == activeLocation.id ?
            activeLocation 
            :
            subLocation
        )}
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