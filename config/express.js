var express = require("express"),
  morgan = require("morgan"),
  passport = require("passport"),
  cors = require("cors"),
  methodOverride = require("method-override"),
  path = require("path"),
  routers = require("./routers"),
  bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
module.exports = () => {
  var app = express();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());

  routers.map((router) => {
    app.use(`/api/${router}`, require(`../routers/${router}.router`));
  });

  // app.use(express.static(path.resolve(__dirname, "../views")));
  // app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../views", "index.html")));

  return app;
};
