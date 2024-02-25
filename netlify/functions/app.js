const serverless = require('serverless-http');
const express = require("express");

const app = express();

const routes = {
  server: require("../../routes/server"),
  console: require("../../routes/console")
}
app.use(routes.server);
app.use(routes.console);


module.exports.handler = serverless(app);
// app.listen(3000);