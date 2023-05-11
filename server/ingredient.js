const express = require("express");
const router = express.Router();
const fs = require("fs");

router.delete("/delete/:id",  async (req, res) => {
    console.log("aaaa");
    fs.readFile("./storage/ingredients.json", "utf8", async (err, jsonString) => {
        if (err) {
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }

        try {
            const jsonIngredients = await JSON.parse(jsonString);
            const newIngredients = jsonIngredients.filter(ingredient => ingredient.id != Number(req.params.id));
 
            fs.writeFileSync("./storage/ingredients.json", newIngredients);
        } catch (e) {
            console.log(e);
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }
    });
});

router.post("/create-or-edit",  async (req, res) => {
    console.log("create or edit");
});

router.get("/",  async (req, res) => {
        fs.readFile("./storage/ingredients.json", "utf8", async (err, jsonString) => {
            if (err) {
                res.status(500).send({
                    errorMessage: "Internal server error",
                });
            }

            try {
                const jsonIngredients = await JSON.parse(jsonString);
                res.send(jsonIngredients);
            } catch (e) {
                res.status(500).send({
                    errorMessage: "Internal server error",
                });
            }
        })
    }
);

router.get("/:id",  async (req, res) => {
    fs.readFile("./storage/ingredients.json", "utf8", async (err, jsonString) => {
        if (err) {
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }

        try {
            const jsonIngredients = await JSON.parse(jsonString);
            const wantedIngredient = jsonIngredients.filter(ingredient => ingredient.id == Number(req.params.id))[0];
            
            if (!wantedIngredient) return res.status(404).send({
                errorMessage: "Ingredient not found",
            });
            
            res.send(wantedIngredient);
        } catch (e) {
            console.log(e);
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }
    });
});

module.exports = router;