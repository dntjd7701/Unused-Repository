const express = require("express");
const http = require("http");
const path = require("path");

// Routers
const guestbookRouter = require("./routes/guestbook");

const port = 8080;

// Application Setup *******************
const application = express()
  //1. static serve(static 파일 읽어들이기)
  .use(express.static(path.join(__dirname, "public")))
  // 2. request body parser
  .use(express.urlencoded({ extended: true })) // application/x-www-form-rulencoded
  .use(express.json()) // application/json
  // 3. view engine setup
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  // 4. request router
  .all("*", function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    next();
  })
  .use("/", guestbookRouter);

// Server setup ************************
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
      case "EACCES":
        console.log(`Port : ${port} requires privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.log(`Port : ${port} is already in charge`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  })
  .listen(port);
