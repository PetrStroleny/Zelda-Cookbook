const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/",  async (req, res) => {
        fs.readFile("./storage/special-effects.json", "utf8", async (err, jsonString) => {
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

module.exports = router;