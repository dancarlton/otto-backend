const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const limiter = require('../middleware/rateLimiter');
const { askOtto } = require('../controllers/gptController');
// const checkGptLimit = require('../middleware/checkGptLimit');

router.post('/chat', auth, limiter, askOtto);
// router.post('/chat', auth, checkGptLimit, askOtto);

module.exports = router;
