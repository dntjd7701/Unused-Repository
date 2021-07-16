/**
 *  Controller 만들것 
 *  내용 변경 !
 *  Restful
 */
const express = require('express');
const controller = require('../controllers/guestbook-api');

const router = express.Router();
router.route('').get(controller.read); // fetch, list
router.route('').post(controller.create); // add
router.route('/:no').delete(controller.delete); // delete

module.exports = router;