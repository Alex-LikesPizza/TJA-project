const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const distPath = path.join(__dirname, '..', 'dist');
const homePath = path.join(distPath, "index.html");

route.use("/index.html", async (req, res, next) => {
  try {
    const fileBuffer = await fs.readFile(homePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = route;
