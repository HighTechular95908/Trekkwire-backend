const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var express = require("./config/express"),
    mongoose = require("./config/mongoose"),
    passport = require("./config/passport"),
    config = require("./config/config"),
    http = require("http");

mongoose().then(() => {
    var app = express();
    passport();
    var server = http.createServer(app);
    server.listen(config.port, () => {
        console.log(`Server is running at http://localhost:${config.port}`)
    });
});