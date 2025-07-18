const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const { askOtto } = require('../controllers/gptController');
// const checkGptLimit = require('../middleware/checkGptLimit');

router.post('/chat', auth, askOtto);
// router.post('/chat', auth, checkGptLimit, askOtto);

module.exports = router;
