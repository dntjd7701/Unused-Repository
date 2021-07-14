const express = require('express');
const controller = require('../controllers/user');

const router = express.Router();

router.route("/joinsuccess").get(controller.joinsuccess);
router.route("/join").get(controller.joinform);
router.route("/join").post(controller.join);
router.route("/login").get(controller.login);

module.exports = router;