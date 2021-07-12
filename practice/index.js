const http = require("http");
const express = require("express");
const path = require("path");

const mainRouter = require("./routers/main");
const userRouter = require("./routers/user");
const port = 8080;

const application = express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .all("*", function (request, response, next) {
    response.locals.request = request;
    response.locals.response = response;
    next();
  })
  .use("/", mainRouter)
  .use("/user", userRouter);

http
  .createServer(application)
  .on("listening", function () {
    console.info(`Http Server running on port ${port}`);
  })
  .on("error", function (error) {
    if (error.syscall !== "listen") {
      throw error;
    }
    switch (error.code) {
      case "EACCESS":
        console.log(`Port : ${port} requires privileges`);
        process.exit(1);
        break;

      case "EADDRINUSE":
        console.log(`Port : ${port} is alread in charge`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  })
  .listen(port);
