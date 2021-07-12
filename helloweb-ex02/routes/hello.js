const { render } = require("ejs");
const express = require("express");

const router = express.Router();
router.route("/01").get(function (req, res) {
  res.render("hello/01");
});

router.route("/02").get(function (req, res) {
  console.log(req.query.no);
  console.log(req.query.email);

  res.render("hello/02", {
    no: req.query.no || "",
    email: req.query.email || "",
  });
});

module.exports = router;
