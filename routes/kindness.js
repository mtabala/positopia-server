const express = require("express");
const kindnessRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

//function to read kindness acts
function readKindness() {
    const kindActsFile = fs.readFileSync("./data/kindacts.json");
    const kindActsData = JSON.parse(kindActsFile);
    return kindActsData;
}

//get acts of kindness
kindnessRouter.get("/", (req, res) => {
    const kindActs = readKindness();
    const kindActsData = kindActs.map((kindAct) => {
        return {
            title: kindAct.title,
            description: kindAct.description,
            image: kindAct.image,
            id: kindAct.id
        }
    })
    res.status(200).json(kindActsData);
});

//get selected act of kindness by id
kindnessRouter.get("/:id", (req, res) => {
    const kindActs = readKindness();
    const kindAct = kindActs.find((kindAct) => kindAct.id === req.params.id);
    res.status(200).json(kindAct);
})


module.exports = kindnessRouter;