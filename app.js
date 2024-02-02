const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

const PORT = 3000;

const routes = {
  home: require("./routes/index"),
}
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', routes.home);


app.listen(PORT);