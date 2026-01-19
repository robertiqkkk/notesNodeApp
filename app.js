const express = require("express");
const mongodb = require("./config/mongodb");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");

const app = express();

mongodb.connect();

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
