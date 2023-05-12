const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const fs = require("fs");
const {returnJSONFromFile} = require("./fs-utils");
const {validate} = require("./validation");

router.delete("/delete/:id",  async (req, res) => {
    const jsonRecipes = await returnJSONFromFile("recipes", res);

    try {
        const newRecipes = jsonRecipes.filter(recipe => recipe.id != Number(req.params.id));
        
        fs.writeFileSync("./storage/recipes.json", JSON.stringify(newRecipes));
        res.send({message: "Ok"});;
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
    const jsonRecipes = await returnJSONFromFile("recipes", res);

    try {
        const jsonData = req.body;
        const editing = jsonData.id != 0;
        let newRecipes = jsonRecipes;

        if (editing) {
            let editedRecipeFound = false;
            newRecipes = newRecipes.map(recipe => {
                const isEditingRecipe = recipe.id == jsonData.id;
                if (isEditingRecipe) editedRecipeFound = true;
                return isEditingRecipe ? jsonData : recipe
            });

            if (!editedRecipeFound) res.status(404).send({
                errorMessage: "Recipe not found",
            });
        } else {
            newRecipes = [{...jsonData, id: jsonRecipes[0].id + 1}, ...newRecipes];
        }
        
        fs.writeFileSync("./storage/recipes.json", JSON.stringify(newRecipes));
        res.send({message: "Ok"});;
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/",  async (req, res) => {
    let jsonRecipes = await returnJSONFromFile("recipes", res);
    
    try {
        if (req?.query["special-effect"]?.length > 0) {
            jsonRecipes = jsonRecipes.filter(recipe => recipe?.specialEffect?.name == req?.query["special-effect"]);
        }
        
        if (req?.query["search"]?.length > 0) {
            jsonRecipes = jsonRecipes.filter(recipe => recipe.name.toLowerCase().includes(req?.query["search"].toLowerCase()));
        }

        res.setHeader('Content-Type', 'application/json');
        if (req?.query["location"].length > 0) {
            fs.readFile("./storage/locations.json", "utf8", async (err, jsonString) => {
                if (err) {
                    res.status(500).send({
                        errorMessage: "Internal server error",
                    });
                }
                const regions = await JSON.parse(jsonString);
                const ingredientsInLocation = regions.map(region => region.locations).flat(1).filter(location => location.name == req?.query["location"])[0].ingredients;
                res.send(jsonRecipes.filter(recipe => recipe.ingredients.some(ingredient => ingredientsInLocation.includes(ingredient))));
            });
        } else {
            res.send(jsonRecipes);
        }
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/:id",  async (req, res) => {
    const jsonRecipes = await returnJSONFromFile("recipes", res);
    const jsonIngredients = await returnJSONFromFile("ingredients", res);
    const jsonSpecialEffects = await returnJSONFromFile("special-effects", res);

    try {
        const wantedRecipe = jsonRecipes.filter(recipe => recipe.id == Number(req.params.id))[0];
        const wantedIngrediences = jsonIngredients.filter(ingredient => wantedRecipe.ingredients.includes(ingredient.id));
        
        if (!wantedRecipe) return res.status(404).send({
            errorMessage: "Recipe not found",
        });

        let wantedSpecialEffect;
        if (wantedRecipe?.specialEffect?.name) {
            wantedSpecialEffect = jsonSpecialEffects.filter(specialEffect => specialEffect.name == wantedRecipe.specialEffect.name)[0];
        }
        
        res.send({recipe: wantedRecipe, ingredients: wantedIngrediences, specialEffect: wantedSpecialEffect});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

module.exports = router;