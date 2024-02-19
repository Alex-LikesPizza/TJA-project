const fs = require("fs").promises;
const path = require("path");
const express = require("express");

const route = express.Router();
const users = require("../keys/admins");

const authorizePagePath = path.join(__dirname, '..', 'console/pages/authorize.html');
const consolePagePath = path.join(__dirname, '..', 'console/pages/console.html');
const cssPath = path.join(__dirname, "..", "console/css");

route.get("/console/css/:FileName", async (req, res, next) => {
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
route.post("/console/pages/console.html", async (req, res, next) => {
  const fileBuffer = await fs.readFile(consolePagePath, 'utf8');
  let body = '';

  req.on('data', (chunk) => {
      body += chunk.toString();
  });

  req.on('end', () => {
    const data = body.split('&');
    const username = data[0].split('=')[1];
    const password = data[1].split('=')[1];
    const user = users.find(user => user.username === username && user.password === password);
    setTimeout(() => {
      if (user) {
        res.setHeader('Content-Type', 'text/html');
        res.send(fileBuffer);
      } else {
        res.redirect("/console/pages/authorize.html");
      }
    }, 1000);
  });
});
route.get("/console/pages/authorize.html", async (req, res, next) => {
  
  try {
    const fileBuffer = await fs.readFile(authorizePagePath, 'utf8');

    res.setHeader('Content-Type', 'text/html');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("Page not found");
  }
});

module.exports = route;