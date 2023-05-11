const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/create-or-edit",  async (req, res) => {
    console.log("create or edit");
});

router.get("/",  async (req, res) => {
    fs.readFile("./storage/locations.json", "utf8", async (err, jsonString) => {
        if (err) {
            res.status(500)
        } else {
            try {
                const jsonLocations = await JSON.parse(jsonString);
                res.json(jsonLocations);
            } catch (e) {
                res.status(500)
            }
        }
        res.send({
            errorMessage: "Internal server error",
        });
    })
}
);

router.get("/:id",  async (req, res) => {
fs.readFile("./storage/locations.json", "utf8", async (err, jsonString) => {
    if (err) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }

    try {
        const jsonLocations = await JSON.parse(jsonString);
        const wantedLocation = jsonLocations.filter(region => region.locations).flat(1).filter(location => location.id == Number(req.params.id));
        
        if (!wantedLocation) return res.status(404).send({
            errorMessage: "Location not found",
        });
        
        res.send(wantedLocation);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});
});

module.exports = router;