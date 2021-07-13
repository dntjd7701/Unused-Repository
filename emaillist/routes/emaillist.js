const express = require("express"); // ES6 이전 방식
const controller = require("../controllers/emaillist");

const router = express.Router();

router.route("").get(controller.index);
router.route("/add").get(controller.form);
router.route("/add").post(controller.add);

// exports.emaillistRouter = router;
module.exports = router;
