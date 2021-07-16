const express = require('express');
const authorized = require('./auth');
const controller = require('../controllers/user');

const router = express.Router();

// post 는 관례상 _(언더바)를 붙이자 
router.route("/joinsuccess").get(authorized, controller.joinsuccess);
router.route("/join").get(controller.join);
router.route("/join").post(controller._join);

router.route("/login").get(controller.login);
router.route("/login").post(controller._login);
router.route("/logout").get(controller.logout);
// router handler인 auth를 만들어서 로그인 없이는 못 들어가게 막자
// spring의 @Auth와 authIntercepter와 같은 역할 
router.route('/update').get(authorized, controller.update);
router.route('/update').post(authorized, controller._update);

module.exports = router;