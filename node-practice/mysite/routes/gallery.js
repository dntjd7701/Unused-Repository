const express = require("express");
const controller = require("../controllers/gallery");
const authorized = require('./auth');

const router = express.Router();

router.route("").get(controller.index);
router.route("/upload").post(authorized('ADMIN'), controller.upload);
router.route("/delete/:no").get(authorized('ADMIN'), controller.delete);


module.exports = router;