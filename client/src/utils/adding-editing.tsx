import { Ingredient } from "../pages/ingredients";
import { Region, ZeldaLocation } from "../pages/locations";
import { Recipe } from "../pages/recipes";

// Ingredient
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
  
// Recipe
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

// Location
  export function editLocation(activeLocation: ZeldaLocation, regionName: string, previousRegionName: string, activeLocations: Region[], setActiveLocations: (values: Region[]) => void) {
    let editedLocations = activeLocations;
    const regionChanged = regionName != previousRegionName;
  
    for (let i = 0; i < activeLocations.length; i++) {
      if (activeLocations[i].name == regionName) {
        if (regionChanged) {
          editedLocations[i].locations = [activeLocation, ...activeLocations[i].locations];
        } else {
          editedLocations[i].locations = editedLocations[i].locations.map(location => location.id == activeLocation.id ?
            activeLocation 
            :
            location
        )}
        continue; 
      }
      if (activeLocations[i].name == previousRegionName && regionChanged) {
        editedLocations[i].locations = editedLocations[i].locations.filter(location => location.id != activeLocation.id);
      }
    }
  
    setActiveLocations(editedLocations);
  }
  export function addLocation(location: ZeldaLocation, regionName: string, activeLocations: Region[], setActiveLocations: (values: Region[]) => void) {
    let editedLocations = activeLocations;
  
    for (let i = 0; i < activeLocations.length; i++) {
      if (activeLocations[i].name == regionName) {
        editedLocations[i].locations = [location, ...activeLocations[i].locations]
      }
    }
  
    setActiveLocations(editedLocations);
  }