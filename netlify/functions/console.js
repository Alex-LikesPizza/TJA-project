const serverless = require('serverless-http');
const express = require("express");
const session = require('express-session');
const path = require("path");
const fs = require("fs").promises;

const app = express();

const sessionKey = require('../../keys/sessionKey');
const users = require("../../keys/admins");
const firebaseConfig = require("../../keys/firebaseConfig");

const authorizePagePath = path.join(__dirname, '../../console/pages/authorize.html');
const consolePagePath = path.join(__dirname, '../../console/pages/console.html');
const cssPath = path.join(__dirname, "../../console/css");
const jsPath = path.join(__dirname, "../../console/js");

app.use(session({
  secret: sessionKey,
  resave: false,
  saveUninitialized: true,
}));
app.post("/console/pages/console.html", async (req, res, next) => {
  if(req.session.isAdmin){
    res.redirect("./console.html");
    res.end();
    return;
  }
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    const data = body.split('&');
    const username = data[0].split('=')[1];
    const password = data[1].split('=')[1];
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }
    res.redirect("./console.html");
  });
});
app.get("/console/pages/console.html", async (req, res, next) => {
  console.log(authorizePagePath);
  if(req.session.isAdmin) {
    const fileBuffer = await fs.readFile(consolePagePath, 'utf8');
    res.setHeader("Content-Type", "text/html");
    res.end(fileBuffer);
  }
  else {
    res.redirect("./authorize.html");
  }
});
app.use("/console/pages/authorize.html", async (req, res, next) => {
  req.session.isAdmin = false;
  try {
    const fileBuffer = await fs.readFile(authorizePagePath, 'utf8');

    res.setHeader('Content-Type', 'text/html');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("Failed to open");
    console.log(error);
  }
});
app.get("/console/js/firebaseConfig.js",  (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript');
  const jsonData = JSON.stringify(firebaseConfig);
  res.end("const firebaseConfig = " + jsonData);
});
app.get("/console/js/:FileName", async (req, res, next) => {
  const fileName = req.originalUrl.split('/').pop();
  const filePath = path.join(jsPath, fileName);
  try {
    const fileBuffer = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'application/javascript');
    res.send(fileBuffer);
  } catch (error) {
    res.status(404).send("File not found");
  }
});
app.get("/console/css/:FileName", async (req, res, next) => {
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
app.get("/console", (req, res, next) => {
  res.redirect("/console/pages/console.html");
});

module.exports.handler = serverless(app);