const express = require("express");
const controller = require("../controllers/guestbook");

const router = express.Router();
router.route("").get(controller.index);
router.route("/add").post(controller.add);
router.route("/deleteform").get(controller.deleteform);
router.route("/deleteform").post(controller.delete);


module.exports = router;