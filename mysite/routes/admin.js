const express = require('express');
const authorized = require('./auth');
const controller = require('../controllers/admin');


const router = express.Router();
// index
router.route('').get(authorized("ADMIN"), controller.index);
router.route('/update').post(authorized("ADMIN"), controller._update);
// user
router.route('/user').get(authorized("ADMIN"), controller.user_index);

// guestbook
router.route('/guestbook').get(controller.guestbook_index);
module.exports = router;