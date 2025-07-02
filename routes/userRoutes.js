const express = require('express')
const router = express.Router()
const { register, updateUser } = require('../controllers/userController')

router.post('/register', register)
router.patch('/update', updateUser)

module.exports = router
