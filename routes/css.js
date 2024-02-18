const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const cssPath = path.join(__dirname, '..', 'dist', 'css');

route.get("/css/:FileName", async (req, res, next) => {
  const fileName = req.originalUrl.split('/').pop();
  const filePath = path.join(cssPath, fileName);
  try {
    const fileBuffer = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'text/css');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("File not found");
  }
});

module.exports = route;