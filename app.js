// const serverless = require('serverless-http');
const express = require("express");

const app = express();

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
  css: require("./routes/css"),
  server: require("./routes/server"),
  console: require("./routes/console")


}

app.use(routes.pages);
app.use(routes.css);
app.use(routes.imports.splide);
app.use(routes.images);
app.use(routes.scripts.components);
app.use(routes.scripts.pages);
app.use(routes.server);
app.use(routes.console);
app.use(routes.index);


// module.exports.handler = serverless(app);
app.listen(3000);