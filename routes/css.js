const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const distPath = path.join(__dirname, '..', 'dist');
const cssPath = path.join(distPath, "css/style.css");

route.get("/css/style.css", async (req, res, next) => {
  try {
    const fileBuffer = await fs.readFile(cssPath, 'utf8');
    res.setHeader('Content-Type', 'text/css');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("File not found");
  }
});

module.exports = route;