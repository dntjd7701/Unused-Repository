const { response } = require("express");
const express = require("express");

const route = express.Router();
route.route("/hi").get(function (request, response) {
  response.render("user/hi", {
    name: request.query.name || "",
    content: request.query.content || "",
  });
});

route.route("/join").get(function (request, response) {
  response.render("user/join");
});

route.route("/join").post(function (request, response) {
  console.log(request.body);
  response.redirect("/user/hi");
  //   {
  //     name: request.body.name || "",
  //     email: request.body.email || "",
  //     password: request.body.password || "",
  //   }
});

route.route("/api").get(function (request, response) {
  const vo = {
    no: 10,
    name: "dooly",
    email: "dooly@gmail.com",
    gender: "mail",
  };
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(vo));
});

module.exports = route;
