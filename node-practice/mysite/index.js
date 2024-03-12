(function(){

const express = require("express");
const session = require("express-session");
const http = require("http");
const multer = require('multer');
const path = require("path");
const dotenv = require('dotenv');


// Environment Variables
// 처음만 받아오면 process는 전역이므로 process.env로 사용가능 
dotenv.config({path: path.join(__dirname, 'config/app.env')});
dotenv.config({path: path.join(__dirname, 'config/db.env')});


const logger = require('./logging');

/**
 *  Application router
 */

const { applicationRouter } = require('./routes');

 const application = express()
 // 1. session environment
 .use(session({
   secret: 'mysite-session', // 쿠키 변조를 위한 값, session cookie 암호화, 솔트 적용->아무렇게 넣어도 괜찮아  
   resave: false,            // 요청 처리에서 세션의 변경사항이 없어도 항상 저장한다.(true, 성능이 안좋아 사용 안함)(false: 처리, req.session.adffas(authUser) = user 이런식으로 직접 처리 , req 안에서 session이 변경됌 )
   saveUninitialized: false  // 새로 session을 생성할 때 "uninitialized" 상태로 둔다. (true) 따라서 로그인 세션에서는 false로 하는 것이 좋다.(초기화 시켜라)
  }))
  // 2. request body parser // name=asdf & json
  .use(express.urlencoded({ extended: true })) // application/x-www-form-rulencoded
  .use(express.json()) // application/json
  // 3. multer (multipartresolver)
  .use(multer({
    dest: path.join(__dirname, process.env.MULTER_TEMPORARY_STORE), // temporary 위치
  }).single('file')) // input의 name
  // __dirname -> mysite, process.env -> public 으로 설정함.
  // 4. static serve(static 파일 읽어들이기)
  .use(express.static(path.join(__dirname, process.env.STATIC_RESOURCES_DIRECTORY)))
  // 5. view engine setup
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");


  // application setup
  applicationRouter.setup(application);

  /**
   *  Server setup
   */

http
.createServer(application)
.on("listening", function () {
  logger.info(`Http Server running on port ${process.env.PORT}`);
})
.on("error", function (error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      logger.error(`Port : ${process.env.PORT} requires privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`Port : ${process.env.PORT} is already in charge`);
      process.exit(1);
      break;
    default:
      throw error;
  }
})
.listen(process.env.PORT);

})();