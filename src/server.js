"use strict";
const express = require("express");
const errorHandler = require("./error-handlers/500");
const notFoundHandler = require("./error-handlers/404");
const authRoutes = require("./auth/routes.js");
const cors = require("cors");
const morgan = require("morgan");

const beforejson =require('./error-handlers/beforejson')

const app = express();
app.use(cors());
app.use(morgan('dev'));
// app.use(beforejson);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(authRoutes)
app.get("/", (req, res) => {
    res.send("welcome to server.js");
});
app.get("/bad", (req, res) => {
    throw new Error("test error");
});
app.use("*", notFoundHandler);
app.use(errorHandler);

function start(port) {
    app.listen(port, () => {
        console.log(`The app is up on ${port}`);
    });
}
module.exports = {
    app: app,
    start: start,
};
