const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const componentsPath = path.join(__dirname, '..', 'dist/js/components');

route.get("/js/components/:fileName", async (req, res, next) => {
  try {
    const fileName = req.originalUrl.split('/').pop();
    const filePath = path.join(componentsPath, fileName);
    
    const fileBuffer = await fs.readFile(filePath, 'utf8');

    res.setHeader('Content-Type', 'application/javascript');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("File not found");
  }
});

module.exports = route;