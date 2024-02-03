const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const importsPath = path.join(__dirname, '..', 'dist/imports');

route.get("/imports/splide/splide.min.js", async (req, res, next) => {
  try {
    const filePath = path.join(importsPath, "splide/splide.min.js");
    const fileBuffer = await fs.readFile(filePath, 'utf8');

    res.setHeader('Content-Type', 'application/javascript');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("Error loading splide (js)");
  }
});
route.get("/imports/splide/splide.min.css", async (req, res, next) => {
  try {
    const filePath = path.join(importsPath, "splide/splide.min.css");
    const fileBuffer = await fs.readFile(filePath, 'utf8');

    res.setHeader('Content-Type', 'text/css');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("Error loading splide (css)");
  }
});

module.exports = route;