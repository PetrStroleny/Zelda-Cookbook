const express = require("express");
const router = express.Router();

router.post("/create-or-edit",  async (req, res) => {
    console.log(req.body);
});

router.get("/",  async (req, res) => {
    fs.readFile("./storage/recipes.json", "utf8", async (err, jsonString) => {
        if (err) {
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }


        try {
            const jsonRecipes = await JSON.parse(jsonString);
            res.send(jsonRecipes);
        } catch (e) {
            res.status(500).send({
                errorMessage: "Internal server error",
            });
        }
    })
}
);

router.get("/:id",  async (req, res) => {
fs.readFile("./storage/recipes.json", "utf8", async (err, jsonString) => {
    if (err) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }

    try {
        const jsonRecipes = await JSON.parse(jsonString);
        const wantedRecipe = jsonRecipes.filter(recipe => recipe.id == Number(req.params.id))[0];
        
        if (!wantedRecipe) return res.status(404).send({
            errorMessage: "Recipe not found",
        });
        
        res.send(wantedRecipe);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});
});

module.exports = router;