const fs = require("fs");
const express = require("express");
const route = express.Router();

route.use("/", (req, res, next) =>{
  console.log("a");
})

module.exports = route;