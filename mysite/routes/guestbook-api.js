/**
 *  Controller 만들것 
 *  내용 변경 !
 *  Restful
 */
const express = require('express');
const controller = require('../controllers/guestbook-api');

const router = express.Router();
router.route('').post(controller.create); // add
router.route('').get(controller.read); // fetch, list
router.route('/:no').delete(controller.delete); // delete



// ex) password=1234 or json --> ajax
// request body parser 해놨으니까 json parser 가능

module.exports = router;