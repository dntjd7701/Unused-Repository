const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require('dotenv');



// Routers
const mainRouter = require("./routes/main");
const userRouter = require('./routes/user');

// Environment Variables
dotenv.config({path: path.join(__dirname, 'config/app.env')});


/**
 *  Application setup
 */
const application = express()
  //1. static serve(static 파일 읽어들이기)
  .use(express.static(path.join(__dirname, process.env.STATIC_RESOURCES_DIRECTORY)))
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
  .use("/", mainRouter)
  .use("/user", userRouter)
  .use((req,res) => res.render('error/404')) //url을 주지 않고 들어온것 (404처리) -> default servlet과 같은 ! 없는 것들의 처리)


/**
 *  Server setup
 */

http
.createServer(application)
.on("listening", function () {
  console.info(`Http Server running on port ${process.env.PORT}`);
})
.on("error", function (error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      console.log(`Port : ${process.env.PORT} requires privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(`Port : ${process.env.PORT} is already in charge`);
      process.exit(1);
      break;
    default:
      throw error;
  }
})
.listen(process.env.PORT);