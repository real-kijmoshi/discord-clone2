const router = require("express").Router();
const snowflake = require("../utils/snowflake");
const fs = require("fs");
const { resolve } = require("path")

fs.existsSync(__dirname + "/../cdn") || fs.mkdirSync(__dirname + "/../cdn");
fs.existsSync(__dirname + "/../cdn/avatars") || fs.mkdirSync(__dirname + "/../cdn/avatars");
fs.existsSync(__dirname + "/../cdn/icons") || fs.mkdirSync(__dirname + "/../cdn/icons");

router.get("/avatar/:id", (req, res) => {
    const { id } = req.params;
    const path = resolve(__dirname + "/../cdn/avatars/" + id)

    if (!fs.existsSync(path)) {
        return res.status(404).send("Not found");
    }

    res.sendFile(path)
});

router.get("/icon/:id", (req, res) => {
    const { id } = req.params;
    const path = resolve(__dirname + "/../cdn/icons/" + id)
    
    if (!fs.existsSync(path)) {
        return res.status(404).send("Not found");
    }

    res.sendFile(path)
});


module.exports = router;