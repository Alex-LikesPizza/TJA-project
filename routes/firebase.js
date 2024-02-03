const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const distPath = path.join(__dirname, '..', 'dist');

route.use("/index.html", async (req, res, next) => {
  

});

module.exports = route;
