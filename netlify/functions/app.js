const serverless = require('serverless-http');
const express = require("express");
const session = require('express-session');

const sessionKey = require('../../keys/sessionKey');

const app = express();

const routes = {
  server: require("../../routes/server"),
  console: require("../../routes/console"),
}
app.use(session({
  secret: sessionKey,
  resave: false,
  saveUninitialized: true,
}));
app.use(routes.server);
app.use(routes.console);


module.exports.handler = serverless(app);