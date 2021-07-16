const express = require("express");
const controller = require("../controllers/guestbook");
//const auth = require('./auth');

const router = express.Router();

router.route("").get(controller.index);
router.route("/add").post(controller._add);
router.route("/delete/:no").get(controller.delete);
router.route("/delete").post(controller._delete);

router.route("/spa").get(controller.spa);

module.exports = router;