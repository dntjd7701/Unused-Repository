const express = require("express");

const route = express.Router();
route.route("").get(function (request, response) {
  response.render("main/index");
});

module.exports = route;
