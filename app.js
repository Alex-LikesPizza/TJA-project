const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

const PORT = 3000;

const routes = {
  index: require("./routes/index"),
  pages: require("./routes/pages"),
  scripts: {
    components: require("./routes/components"),
    pages: require("./routes/scripts")
  },
  imports: {
    splide: require("./routes/splide")
  },
  images: require("./routes/images"),
  css: require("./routes/css")


}

app.use(bodyParser.urlencoded({extended: false}));

app.use(routes.index);
app.use(routes.pages);
app.use(routes.css);
app.use(routes.imports.splide);
app.use(routes.images);
app.use(routes.scripts.components);
app.use(routes.scripts.pages);


app.listen(PORT);