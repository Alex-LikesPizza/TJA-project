const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const pagesPath = path.join(__dirname, '..', 'dist/images');

route.get("/images/:fileName", async (req, res, next) => {
  try {
    const fileName = req.originalUrl.split('/').pop();
    const filePath = path.join(pagesPath, fileName);
    
    const fileBuffer = await fs.readFile(filePath);

    let contentType;
    switch(path.extname(filePath).toLocaleLowerCase()){
      case "png":
        contentType = "image/png"
        break;
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg"
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "bmp":
        contentType = "image/bmp";
        break;
      case "webp":
        contentType = "image/webp";
      default:
        contentType = "application/octet-stream";
        break;
    }
    res.setHeader('Content-Type', contentType);
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("Image not found");
  }
});

module.exports = route;