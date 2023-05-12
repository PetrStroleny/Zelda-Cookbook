const express = require("express");
const router = express.Router();
const {returnJSONFromFile} = require("./fs-utils");
const fs = require("fs");
const {validate} = require("./validation");
const { body } = require('express-validator');

function locationCanBeDeleted(activeLocationID, regions) {
    const locations = regions.map(region => region.locations).flat(1);
    const othersIngredients = locations.filter(location => location.id != activeLocationID).map(location => location.ingredients).flat(1);
    const activeLocationIngredients = locations.filter(location => location.id == activeLocationID).map(location => location.ingredients).flat(1);

    let lonelyIngredients = [];
    for (const ingredient of activeLocationIngredients) {
      if (!othersIngredients.includes(ingredient)) lonelyIngredients.push(ingredient);
    }

    return lonelyIngredients;
  }

router.delete("/delete/:id",  async (req, res) => {
    const jsonLocations = await returnJSONFromFile("locations", res);
    const jsonIngredients = await returnJSONFromFile("ingredients", res);

    try {
        const ingredientHasOnlyThisLocation = locationCanBeDeleted(Number(req.params.id), jsonLocations);
        
        if (ingredientHasOnlyThisLocation.length > 0) {
            res.status(409).send({errorMessage: 
                `Lokace nelze smazat, ingredience: ${ingredientHasOnlyThisLocation.map(onlyOneLocation => jsonIngredients.filter(ingredient => ingredient.id == onlyOneLocation)[0].name).join(", ")} by již nebyly v žádných lokací. Přiřadťe k těmto ingrediencím další lokace nebo tyto ingredience smažte.`
            })
        } else {
            const newLocations = jsonLocations.map(region => ({...region, locations: region.locations.filter(location => location.id != Number(req.params.id))}));
            
            fs.writeFileSync("./storage/locations.json", JSON.stringify(newLocations));
            res.send({message: "Ok"});;
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
    ]),  
    async (req, res) => {
    const jsonLocations = await returnJSONFromFile("locations", res);

    try {
        const jsonData = req.body;
        const editing = jsonData.id != 0;
        let newLocations = jsonLocations;
        let newRegionIndex = 0;
        jsonLocations.map((region, index) => {
            if (region.name == jsonData.regionName) {
                newRegionIndex = index;
            }
        });

        let editedLocations = jsonLocations;
        
        if (editing) {
            let editedLocationFound = false;
            let regionChangedIndex = -1;

            for (let i = 0; i < jsonLocations.length; i++) {
                if (jsonLocations[i].locations.filter(location => location.id == jsonData.id).length > 0 && jsonLocations[i].name != jsonData.regionName) {
                    regionChangedIndex = i;
                    editedLocationFound = true;
                }
            }

            if (regionChangedIndex != -1) {
                editedLocations[regionChangedIndex].locations = editedLocations[regionChangedIndex].locations.filter(location => location.id != jsonData.id);
                editedLocations[newRegionIndex].locations = [...editedLocations[newRegionIndex].locations, jsonData]
            } else {
                editedLocations[newRegionIndex].locations = editedLocations[newRegionIndex].locations.map(location => {
                    let locationIsEdited = location.id == jsonData.id;
                    if (locationIsEdited) editedLocationFound = true;
                    return locationIsEdited ? jsonData : location});
            }

            if(!editedLocationFound) return res.status(404).send({
                errorMessage: "Location not found",
            });

        } else {
            let biggestLocationID = 1;
            jsonLocations.map(region => region.locations).flat(1).map(location => {if(location.id > biggestLocationID) biggestLocationID = location.id});
            editedLocations[newRegionIndex].locations = [{...jsonData, id: biggestLocationID + 1}, ...editedLocations[newRegionIndex].locations]
        }
        

        fs.writeFileSync("./storage/locations.json", JSON.stringify(newLocations));
        res.send({message: "Ok"});;
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/", async (req, res) => {
    let jsonLocations = await returnJSONFromFile("locations", res);

    try {
        if (req?.query["search"]?.length > 0) {
            let newLocations = [];
            for (const region of jsonLocations) {
                let editedRegion = region;
                editedRegion.locations = editedRegion.locations.filter(location => location.name.toLowerCase().includes(req?.query["search"].toLowerCase()))
                newLocations.push(editedRegion);
            }
            jsonLocations = newLocations;
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(jsonLocations);
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
}
);

router.get("/:id",  async (req, res) => {
    const jsonLocations = await returnJSONFromFile("locations", res);
    const jsonIngredients = await returnJSONFromFile("ingredients", res);

    try {
        const wantedLocation = jsonLocations.map(region => region.locations).flat(1).filter(location => location.id == Number(req.params.id))[0];
        const wantedIngredients = jsonIngredients.filter(ingredient => wantedLocation.ingredients.includes(ingredient.id));
        
        if (!wantedLocation) return res.status(404).send({
            errorMessage: "Location not found",
        });
        
        res.send({location: wantedLocation, ingredients: wantedIngredients});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

module.exports = router;