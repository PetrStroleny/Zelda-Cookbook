const fs = require("fs");

async function returnJSONFromFile(url, res) {
    const data = fs.readFileSync(`./storage/${url}.json`, "utf8");
    return await JSON.parse(data);
}

module.exports = {returnJSONFromFile};