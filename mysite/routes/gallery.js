const express = require("express");
const controller = require("../controllers/gallery");
//const auth = require('./auth');

const router = express.Router();

router.route("").get(controller.index);
//router.route("/delete/:no").get(controller.delete);
//router.route("/update").post(controller.upload);


module.exports = router;