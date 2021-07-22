const express = require("express");
const controller = require('../controllers/board');
const router = express.Router();
const authorized = require('./auth');


router.route("").get(controller.index);
router.route("/view/:no").get(controller.view);
router.route("/modify/:no").get(authorized(), controller.modify);
router.route("/modify").post(authorized(), controller._modify);
router.route("/write").get(authorized(), controller.write);
router.route("/write").post(authorized(), controller._write);
router.route("/reply/:no").get(authorized(), controller.reply);
router.route("/reply/:no").post(authorized(), controller._reply);
router.route("/delete/:no").get(authorized(), controller.delete);

module.exports = router;