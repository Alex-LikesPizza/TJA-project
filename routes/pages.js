const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const pagesPath = path.join(__dirname, '..', 'dist/pagini');

route.get("/pagini/:fileName", async (req, res, next) => {
  try {
    const fileName = req.originalUrl.split('/').pop();
    const filePath = path.join(pagesPath, fileName);
    
    const fileBuffer = await fs.readFile(filePath, 'utf8');

    res.setHeader('Content-Type', 'text/html');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("Page not found");
  }
});

module.exports = route;