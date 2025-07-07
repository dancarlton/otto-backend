const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { askOtto } = require('../controllers/gptController')

router.post('/chat', auth, askOtto)

module.exports = router
