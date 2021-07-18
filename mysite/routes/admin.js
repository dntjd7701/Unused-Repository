const express = require('express');
const authorized = require('./auth');
const controller = require('../controllers/admin');


const router = express.Router();
router.route('').get(controller.index);
router.route('/update').post(controller._update);
module.exports = router;