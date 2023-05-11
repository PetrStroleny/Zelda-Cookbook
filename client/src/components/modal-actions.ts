import { useContext, useEffect, useState } from "react";
import { LinkCard } from "./modal";
import { Recipe } from "../pages/recipes";
import { Ingredient, SpecialEffectBackend } from "../pages/ingredients";
import { ZeldaLocation } from "../pages/locations";
import { deleteData, getData } from "../network";
import { removeSpecialEffectFromName } from "./food-card";
import { GlobalContext } from "../utils/global-context";

interface IngredientWithInfo {
    ingredient: Ingredient
    recipes: Recipe[]
    locations: ZeldaLocation[]
    specialEffect: SpecialEffectBackend
  }
  
  interface ZeldaLocationWithInfo {
    location: ZeldaLocation
    ingredients: Ingredient[]
  }
  
  interface RecipeWithInfo {
    recipe: Recipe
    ingredients: Ingredient[]
    specialEffect: SpecialEffectBackend
  }
  
export function useModalActions() {
    const [imgSrc, setImgSrc] = useState("");
    const [label, setLabel] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>();
    const [specialEffect, setSpecialEffect] = useState<{imgSrc: string, duration: number}>();
    const [linkCards, setLinkCards] = useState<{label: string, cards: LinkCard[]}[]>([{label: "", cards: []}]);
    const {modalQuery, setModalQuery} = useContext(GlobalContext);
    const activeID = modalQuery.split("-")[modalQuery.split("-").length - 2];

    useEffect(() => { 
        switch (modalQuery.split("-")[0]) {
          case "ingredient": {
            fetchModalDataIngredient(Number(activeID));
            return;
          }
  
          case "location": {
            fetchModalDataLocation(Number(activeID));
            return;
          }
  
          case "recipe": {
            fetchModalDataRecipe(Number(activeID));
          }
        }
      }, [modalQuery]);
    
    async function fetchModalDataIngredient(id: number) {
        try {
          const activeIngredient: IngredientWithInfo = await getData(`ingredient/${id}`);
          
          const recipeIcon = removeSpecialEffectFromName(activeIngredient.ingredient.name, activeIngredient.ingredient.specialEffect != null);
          setImgSrc(`public/ingredients/${recipeIcon}.png`);
          setLabel(activeIngredient.ingredient.name);
          setDescription(activeIngredient.ingredient.description);
          setPrice(activeIngredient.ingredient.price);
          if (activeIngredient.specialEffect && activeIngredient.ingredient.specialEffect) {
            setSpecialEffect({imgSrc: activeIngredient.specialEffect.imgSrc, duration: activeIngredient.ingredient.specialEffect.duration})
          } else {
            setSpecialEffect(undefined);
          }
          setLinkCards([
            {
              label: "Lokace", 
              cards: activeIngredient.locations.map(
                location => ({
                      name: location.name, 
                      modalQuery: `location-${location.id}-1`, 
                      imgSrc: `public/locations/${location.name.replaceAll(" ", "_")}.png`
                    })
                )
            },
            {
            label: "Možné recepty", 
            cards: activeIngredient.recipes.map(
                recipe => ({
                    name: recipe.name, 
                    modalQuery: `recipe-${recipe.id}-1`, 
                    imgSrc: `public/recipes/${removeSpecialEffectFromName(recipe.name, recipe.specialEffect != null)}.png`
                  })
              )
          }]);
        } catch(e) {
          console.error(e);
        }
      }
      async function fetchModalDataLocation(id: number) {
        const activeLocaiton: ZeldaLocationWithInfo = await getData(`location/${id}`);
        setImgSrc(`public/locations/${activeLocaiton.location.name.replaceAll(" ", "_")}.png`);
        setLabel(activeLocaiton.location.name);
        setDescription(activeLocaiton.location.description);
        setPrice(undefined);
        setSpecialEffect(undefined);
        setLinkCards([{
          label: "Ingredience", 
          cards: activeLocaiton.ingredients.map(
              ingredient => ({
                  name: ingredient.name, 
                  modalQuery: `ingredient-${ingredient.id}-1`, 
                  imgSrc: `public/ingredients/${removeSpecialEffectFromName(ingredient.name, ingredient.specialEffect != null)}.png`
                })
            )
        }]);
      }
      async function fetchModalDataRecipe(id: number) {
        const activeRecipe: RecipeWithInfo = await getData(`recipe/${id}`);
        const recipeIcon = removeSpecialEffectFromName(activeRecipe.recipe.name, activeRecipe.recipe.specialEffect != null);
        setImgSrc(`public/recipes/${recipeIcon}.png`);
        setLabel(activeRecipe.recipe.name);
        setDescription(activeRecipe.recipe.description);
        setPrice(activeRecipe.recipe.price);
        if (activeRecipe.specialEffect && activeRecipe.recipe.specialEffect) {
          setSpecialEffect({imgSrc: activeRecipe.specialEffect.imgSrc, duration: activeRecipe.recipe.specialEffect.duration})
        } else {
          setSpecialEffect(undefined);
        }
        setLinkCards([{
          label: "Ingredience", 
          cards: activeRecipe.ingredients.map(
            ingredient => ({
                name: ingredient.name, 
                modalQuery: `ingredient-${ingredient.id}-1`, 
                imgSrc: `ingredients/${removeSpecialEffectFromName(ingredient.name, ingredient.specialEffect != null)}.png`
              })
          )
        }]);
      }

      async function deleteIngredient() {
        try {
            console.log("dsadsa");
            await deleteData(`ingredient/delete/${activeID}`);
            console.log("Laaaaa");
            setModalQuery("");
        } catch (e: any) {
            if (e.errorMessage) alert(e.errorMessage);
        }
      }

      async function deleteRecipe() {
        await deleteData(`recipe/delete/${activeID}`);
        setModalQuery("");
      }

      async function deleteLocation() {
        try {
            await deleteData(`location/delete/${activeID}`);
            setModalQuery("");
          } catch (e: any) {
            if (e.errorMessage) alert(e.errorMessage);
          }
      }

    return {
        imgSrc, label, description,
        price, specialEffect, linkCards,
        deleteIngredient, deleteRecipe, deleteLocation
    }
}