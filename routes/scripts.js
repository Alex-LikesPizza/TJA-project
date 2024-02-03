const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const distPath = path.join(__dirname, '..', 'dist');
const scriptsPath = path.join(distPath, "js/pages");

route.get("/js/pages/:fileName", async (req, res, next) => {
  try {
    const fileName = req.originalUrl.split('/').pop();
    const fullPath = path.join(scriptsPath, fileName);

    const fileBuffer = await fs.readFile(fullPath, 'utf8');
    res.setHeader('Content-Type', 'application/javascript');
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).send("Could not reach " + fullPath);
    console.log(error);
  }
});

module.exports = route;
