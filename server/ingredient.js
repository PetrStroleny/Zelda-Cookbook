const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const fs = require("fs");
const {returnJSONFromFile} = require("./fs-utils");
const {validate} = require("./validation");

router.delete("/delete/:id",  async (req, res) => {
    const jsonIngredients = await returnJSONFromFile("ingredients", res);
    const jsonRecipes = await returnJSONFromFile("recipes", res);

    try {
        const recipeHasOnlyThisIngredient = jsonRecipes.filter(filter => filter.ingredients.length == 1 && filter.ingredients.includes(Number(req.params.id)));

        if (recipeHasOnlyThisIngredient.length > 0) {
            res.status(409).send({errorMessage: 
                `Ingredience nelze smazat, recepty: ${recipeHasOnlyThisIngredient.map(recipe => recipe.name).join(", ")} by již nemohly být vytvořené. Přidejte k těmto receptům další ingredience nebo je smažte.`
            })
        } else {
            const newIngredients = jsonIngredients.filter(ingredient => ingredient.id != Number(req.params.id));
            
            fs.writeFileSync("./storage/ingredients.json", JSON.stringify(newIngredients));
            res.send({message: "Ok"});
        }
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/create-or-edit", 
validate([
    body("name").isLength({min: 1, max: 150}),  
    body("description").isLength({min: 1, max: 750}),  
    body("specialEffectDuration").isInt({min: 1, max: 9999}).optional(),  
    body("extraHearts").isInt({min: 1, max: 999}).optional(),  
    body("numberOfHearts").isDecimal({min: 0.5, max: 999}),  
    body("price").isInt({min: 0, max: 999})
]),
    async (req, res) => {
    const jsonIngredients = await returnJSONFromFile("ingredients", res);
    const jsonLocations = await returnJSONFromFile("locations", res);

    try {
        const jsonData = req.body;
        const editing = jsonData.id != 0;
        let newIngredients = jsonIngredients;

        if (editing) {
            let editedIngredientFound = false;
            newIngredients = newIngredients.map(ingredient => {

                let isEditingIngredient = ingredient.id == jsonData.id;
                if (isEditingIngredient) editedIngredientFound = true;
                return isEditingIngredient ? jsonData : ingredient
            });
            if (!editedIngredientFound) res.status(404).send({
                errorMessage: "Ingredient not found",
            });
        } else {
            newIngredients = [{...jsonData, id: jsonIngredients[0].id + 1}, ...newIngredients];
        }
        
        let newLocations = [];
        for (const region of jsonLocations) {
            let editedRegion = {...region};
            editedRegion.locations = [];

            for (const location of region.locations) {
                let editedLocation = location;
                // ingredience není v lokaci ale uživatel je do této lokace chce přidat
                if (jsonData.locations.includes(location.id) && !location.ingredients.includes(editing ? jsonData.id : jsonIngredients[0].id + 1)) {
                    editedLocation.ingredients = [...editedLocation.ingredients, editing ? jsonData.id : jsonIngredients[0].id + 1];
                }

                if (editing) {
                    // ingredience je v lokaci ale uživatel je do z této lokace chce odebrat
                    if (!jsonData.locations.includes(location.id) && location.ingredients.includes(jsonData.id)) {
                        editedLocation.ingredients = editedLocation.ingredients.filter(ingredient => ingredient != jsonData.id);
                    }
                }

                editedRegion.locations.push(editedLocation);
            }
            newLocations.push(editedRegion);
        }

        fs.writeFileSync("./storage/ingredients.json", JSON.stringify(newIngredients));
        fs.writeFileSync("./storage/locations.json", JSON.stringify(newLocations));
        res.send({message: "Ok"});;
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/",  async (req, res) => {
    let jsonIngredients = await returnJSONFromFile("ingredients", res);

    try {
            if (req?.query["special-effect"]?.length > 0) {
                jsonIngredients = jsonIngredients.filter(ingredient => ingredient?.specialEffect?.name == req?.query["special-effect"]);
            }

            if (req?.query["search"]?.length > 0) {
                jsonIngredients = jsonIngredients.filter(ingredient => ingredient.name.toLowerCase().includes(req?.query["search"].toLowerCase()));
            }
            
            res.setHeader('Content-Type', 'application/json');
            if (req?.query["location"]?.length > 0) {
                fs.readFile("./storage/locations.json", "utf8", async (err, jsonString) => {
                    if (err) {
                        res.status(500).send({
                            errorMessage: "Internal server error",
                        });
                    }
                    const regions = await JSON.parse(jsonString);
                    const ingredientsInLocation = regions.map(region => region.locations).flat(1).filter(location => location.name == req?.query["location"])[0].ingredients;
                    res.send(jsonIngredients.filter(ingredient => ingredientsInLocation.includes(ingredient.id)));
                });
            } else {
                res.send(jsonIngredients);
            }
        } catch (e) {
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }
    }
);

router.get("/:id",  async (req, res) => {
    const jsonIngredients = await returnJSONFromFile("ingredients", res);
    const jsonLocations = await returnJSONFromFile("locations", res);
    const jsonRecipes = await returnJSONFromFile("recipes", res);
    const jsonSpecialEffects = await returnJSONFromFile("special-effects", res);

    try {
        const wantedIngredient = jsonIngredients.filter(ingredient => ingredient.id == Number(req.params.id))[0];
        if (!wantedIngredient) {
            return res.status(404).send({
                errorMessage: "Ingredient not found",
            });
        }

        const wantedLocations = jsonLocations.map(region => region.locations).flat(1).filter(location => location.ingredients.includes(wantedIngredient.id));
        const wantedRecipes = jsonRecipes.filter(recipe => recipe.ingredients.includes(wantedIngredient.id));


        let wantedSpecialEffect;
        if (wantedIngredient?.specialEffect?.name) {
            wantedSpecialEffect = jsonSpecialEffects.filter(specialEffect => specialEffect.name == wantedIngredient.specialEffect.name)[0];
        }
        
        res.send({ingredient: wantedIngredient, locations: wantedLocations, recipes: wantedRecipes, specialEffect: wantedSpecialEffect});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

module.exports = router;