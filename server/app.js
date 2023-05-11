//načtení modulu express
const express = require("express");
const cors = require("cors");

const ingredientRouter = require("./ingredient.js");
const recipeRouter = require("./recipe.js");
const locationRouter = require("./location.js");

//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

const corsOptions = {
  origin: 'http://localhost:5173',
}
app.use(cors())

app.use("/ingredient", ingredientRouter);
app.use("/recipe", recipeRouter);
app.use("/location", locationRouter);
app.use("/special-effect", locationRouter);

app.get("/*", (req, res) => {
  res.send("Unknown path!");
});

//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
