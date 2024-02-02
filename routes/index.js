const fs = require("fs");
const path = require("path");
const express = require("express");
const route = express.Router();

const distPath = path.join(__dirname, '..', 'dist');
const homePath = path.join(distPath, "index.html");
route.use("/home", (req, res, next) =>{
  const fileBuffer = fs.readFileSync(homePath);
  res.setHeader('Content-Type', 'text/html');
  res.send(fileBuffer)
});

module.exports = route;